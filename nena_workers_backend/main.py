
from fastapi import FastAPI
from nena_workers_backend.monitoring import routes as monitoring_routes
from nena_workers_backend.security import routes as security_routes
from nena_workers_backend.user_analysis import routes as user_analysis_routes

app = FastAPI()

app.include_router(monitoring_routes.router, prefix="/monitoring")
app.include_router(security_routes.router, prefix="/security")
app.include_router(user_analysis_routes.router, prefix="/user-analysis")

@app.get("/")
def read_root():
    return {"Hello": "Nena Workers"}
