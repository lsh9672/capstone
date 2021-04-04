import cv2
import pytesseract
import numpy as np


def ocr_text(filename):
    img = cv2.imread(filename)
    return(pytesseract.image_to_string(img, lang='kor+eng',config='--oem 1 --psm 3'))

def paragraph(filename):
    image = cv2.imread(filename)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (7,7), 0)
    thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5,5))
    dilate = cv2.dilate(thresh, kernel, iterations=4)

    cnts = cv2.findContours(dilate, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    imgNum = 1
    for c in reversed(cnts):
        x,y,w,h = cv2.boundingRect(c)
        cv2.rectangle(image, (x, y), (x + w, y + h), (36,255,12), 2)
        crop_img = image[y:y+h, x:x+w]
        cv2.imwrite("static/uploads/paragrapy" + str(imgNum) + ".png", crop_img)
        imgNum += 1
    return None
