from flask import Flask
import os
from routes.login import login_bp
from routes.agents import agents_bp
from routes.dashboards import dashboards_bp
from routes.data_engineering import data_engineering_bp
from routes.marketing_agent import marketing_agent_bp
from routes.data_sources import data_sources_bp
from routes.charts import charts_bp
from supabase import create_client, Client
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app)

app.register_blueprint(login_bp)
app.register_blueprint(agents_bp)
app.register_blueprint(dashboards_bp)
app.register_blueprint(data_engineering_bp)
app.register_blueprint(marketing_agent_bp)
app.register_blueprint(data_sources_bp)
app.register_blueprint(charts_bp)

if __name__ == '__main__':
    app.run(debug=True)