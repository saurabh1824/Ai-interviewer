from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import asyncio


client=AsyncIOMotorClient(settings.mongo_url)
db = client[settings.mongo_db_name]


async def test_connection():
    try:
        # Test the connection by listing collections
        collections = await db.list_collection_names()
        print("Successfully connected to MongoDB")
        print("Collections:", collections)
        return True
    except Exception as e:
        print("Failed to connect to MongoDB:", e)
        return False


if __name__ == "__main__":
    import asyncio
    asyncio.run(test_connection())