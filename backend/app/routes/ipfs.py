import json
import httpx
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from app.config import settings

router = APIRouter(prefix='/ipfs', tags=['IPFS'])
PINATA_UPLOAD_URL = 'https://uploads.pinata.cloud/v3/files'

@router.post('/upload')
async def upload_to_pinata(file: UploadFile = File(...), name: str | None = Form(None)):
    if not settings.PINATA_JWT:
        raise HTTPException(status_code=500, detail='PINATA_JWT is missing in backend .env')

    file_bytes = await file.read()
    files = {'file': (file.filename, file_bytes, file.content_type or 'application/octet-stream')}
    data = {
        'network': 'public',
        'name': name or file.filename,
        'keyvalues': json.dumps({'project': 'TrustChain', 'type': 'charity-proof'}),
    }
    headers = {'Authorization': f'Bearer {settings.PINATA_JWT}'}

    try:
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(PINATA_UPLOAD_URL, headers=headers, data=data, files=files)
        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        result = response.json()
        cid = result.get('data', {}).get('cid') or result.get('IpfsHash')
        if not cid:
            raise HTTPException(status_code=500, detail=f'Pinata response did not return CID: {result}')
        gateway_url = f"{settings.PINATA_GATEWAY.rstrip('/')}/ipfs/{cid}"
        return {'ok': True, 'cid': cid, 'ipfs_hash': cid, 'gateway_url': gateway_url, 'pinata': result}
    except httpx.RequestError as error:
        raise HTTPException(status_code=502, detail=f'Pinata upload failed: {str(error)}')
