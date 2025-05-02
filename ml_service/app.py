from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.linear_model import LogisticRegression
import numpy as np

app = FastAPI()
model = LogisticRegression()
X_train = np.array([[3.5, 20000], [2.0, 50000], [4.0, 15000]])
y_train = np.array([1, 0, 1])
model.fit(X_train, y_train)

class StudentData(BaseModel):
    gpa: float
    income: float

@app.post("/predict")
async def predict(data: StudentData):
    features = np.array([[data.gpa, data.income]])
    prediction = model.predict(features)[0]
    return {"eligibility": bool(prediction)}