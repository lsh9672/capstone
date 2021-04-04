from flask import Blueprint, render_template,request
import json
import os


from ocr_web.models import UserInformation

bp = Blueprint('main',__name__,url_prefix='/')

@bp.route('/',methods=('GET','POST'))
def main_page():
	if request.method =="GET":
		select_list=['전체','문단별']
		return render_template('web_page/first_page.html',select_list=select_list)
	elif request.method =="POST":
		test2=request.form.get('btn_select')
		
		if test2 =="일반":
			select_list=['전체','문단별']
			return render_template('web_page/first_page.html',select_list=select_list,test2=test2)
		elif test2=="지정":
			return render_template('web_page/first_page.html',test2=test2)

@bp.route('/2',methods=('GET','POST'))
def hello_ocr2():
	test_request={"adsf":89706}
	test_request2=json.dumps(test_request)
	if request.method=="GET":
		return render_template('web_page/first_page_result.html',test_request=test_request2)

@bp.route('/3')
def hello_ocr3():
	return render_template('web_page/third_page.html')

