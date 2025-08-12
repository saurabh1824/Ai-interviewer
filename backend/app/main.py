from fastapi import FastAPI 
from typing import Optional
from pydantic import BaseModel
# use HTTPException ,status for raising the error in more structured way 
class Item(BaseModel):
    name:str
    price:int

app = FastAPI() 

store_items ={}
@app.get("/")
async def read_root():  
    return {"message": "Hello, World!"} 



@app.get("/items/{item_id}")
async def read_item(item_id: int):
    if item_id in store_items:
        item = store_items[item_id]
        return {"item_id": item_id, "item": item.dict()}
    return {"message": "Item not found"}

@app.get("/items/")
async def get_item_byname(name:str):
    for item_id, item in store_items.items():
        if item.name == name:
            return {"item_id": item_id, "item": item.dict()}
    return {"message": "Item not found with the given name"}
    

@app.post("/add-items/")
async def add_items(item_id: int,item:Item):
    if item_id in store_items:
        return {"message": "Item already exists"}
    store_items[item_id] = item
    return {"message": "Item added successfully", "item_id": item_id, "item": item.dict()}