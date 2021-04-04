# import json
# import cv2
#
# def color(c):
#     if c == 1:
#         b = (0,255,0)
#     if c == 2:
#         b = (0,0,255)
#     if c == 3:
#         b=(0,255,255)
#     if c == 4:
#         b = (255,0,0)
#     if c == 5:
#         b = (255,0,255)
#     return b
#
# with open('/Users/kimkiju/Downloads/publaynet/val.json', 'r') as f:
#     for line in f:
#         json_data = json.loads(line)
#
# img = cv2.imread('/Users/kimkiju/Downloads/val_mini/PMC3777717_00006.jpg')
#
# for i in range(0,len(json_data["images"])):
#     if json_data["images"][i]['file_name'] == 'PMC3777717_00006.jpg':
#         id = json_data["images"][i]['id']
#
# for j in range(0,len(json_data["annotations"])):
#     if id == json_data["annotations"][j]['image_id']:
#         print(json_data["annotations"][j]['bbox'])
#         box_color=color(json_data["annotations"][j]['category_id'])
#         x = json_data["annotations"][j]['bbox'][0]
#         y = json_data["annotations"][j]['bbox'][1]
#         w = json_data["annotations"][j]['bbox'][2]
#         h = json_data["annotations"][j]['bbox'][3]
#         cv2.rectangle(img, (int(x)-1, int(y)-1), (int(x+w)+2, int(y+h)+2), box_color, 1)
#
# cv2.imshow('img',img)
# cv2.waitKey(0)
# cv2.destroyAllWindows()
#


import json


def category(n):
    if n in [1,2,3]:
        result = 'Text'
    elif n == 4:
        result = 'Table'
    elif n == 5:
        result ='Figure'
    else:
        result ='ERR'
    return result


img_filname =[]
id =[]


with open('train.json', 'r') as f:
    for line in f:
        json_data = json.loads(line)

txtfile = open('mydata.txt','a+')

for i in range(0,len(json_data["images"])):
    img_filname.append(json_data["images"][i]['file_name'])
    id.append(json_data["images"][i]['id'])

for j in range(0,len(json_data["annotations"])):
    if json_data["annotations"][j]['image_id'] in id:
        id_index = id.index(json_data["annotations"][j]['image_id'])
        x = int(json_data["annotations"][j]['bbox'][0])-1
        y = int(json_data["annotations"][j]['bbox'][1])-1
        w = int(json_data["annotations"][j]['bbox'][2])+2
        h = int(json_data["annotations"][j]['bbox'][3])+2
        category_num = category(json_data["annotations"][j]['category_id'])
        # print(img_filname[id_index],",",x,y,x+w,y+h,",",category_num)
        txtfile.write('/img_files/'+img_filname[id_index]+','+str(x)+','+str(y)+','+str(x+w)+','+str(y+h)+','+str(category_num)+'\r\n')
txtfile.close()
