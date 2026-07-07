import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME: str = os.getenv('APP_NAME', 'TrustChain API')
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')
        if origin.strip()
    ]
    PINATA_JWT: str = os.getenv('PINATA_JWT', '')
    PINATA_GATEWAY: str = os.getenv('PINATA_GATEWAY', 'https://gateway.pinata.cloud')

settings = Settings()
