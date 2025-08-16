from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import asyncio

async def test_connection():
    client = AsyncIOMotorClient(settings.mongo_url)
    db = client[settings.mongo_db_name]
    collections = await db.list_collection_names()
    print("Collections:", collections)


if __name__ == "__main__":
    asyncio.run(test_connection())