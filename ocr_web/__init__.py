from flask import Flask

#ORM 사용을 위한 import
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

import config

#Flaks-Migrate-파이썬 모델을 이용해 테이블생성, 컬럼추가등의 작업을 하게 해줌
db = SQLAlchemy()
migrate = Migrate()


#application factory
def create_app():
	app = Flask(__name__)

	#config.py에 작성한 항목을 app.config 환경변수로 부르기 위함
	app.config.from_object(config)

	
	#for ORM - 위에서 만든 전역변수(db,migrate)를 초기화
	db.init_app(app)
	migrate.init_app(app,db)

	from . import models

	#for blue print
	from .views import main_views
	app.register_blueprint(main_views.bp)
	
	return app

if __name__=='__main__':
	create_app().run(host='0.0.0.0',port=8000,debug=True)
