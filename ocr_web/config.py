import os

BASE_DIR = os.path.dirname(__file__)


SQLALCHEMY_DATABASE_URI = 'sqlite:///{}'.format(os.path.join(BASE_DIR, 'ocr_web.db'))
#SQLAlchemy이벤트 처리하는 옵션
SQLALCHEMY_TRACK_MODIFICATIONS=False  