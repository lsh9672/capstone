from ocr_web import db

class UserInformation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    template_name= db.Column(db.String(200), nullable=False)