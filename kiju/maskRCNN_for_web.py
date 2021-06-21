# 선행 작업! git clone  https://github.com/akTwelve/Mask_RCNN.git

import os
import sys
import json
import numpy as np
import time
from PIL import Image, ImageDraw

import skimage
import cv2
import imutils

ROOT_DIR = '여기다가 maskrcnn clone 된 폴더위치 넣어!'
assert os.path.exists(ROOT_DIR), 'ROOT_DIR does not exist. Did you forget to read the instructions above? ;)'

# Import mrcnn libraries
sys.path.append(ROOT_DIR)
from mrcnn.config import Config
import mrcnn.utils as utils
from mrcnn import visualize
import mrcnn.model as modellib


class TableConfig(Config):
    # Give the configuration a recognizable name
    NAME = "table"

    # Train on 1 GPU and 1 image per GPU. Batch size is 1 (GPUs * images/GPU).
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1

    # Number of classes (including background)
    NUM_CLASSES = 1 + 1  # background + 1 (cig_butt)

    # All of our training images are 512x512
    IMAGE_MIN_DIM = 512
    IMAGE_MAX_DIM = 512

    # You can experiment with this number to see if it improves training
    STEPS_PER_EPOCH = 500

    # This is how often validation is run. If you are using too much hard drive space
    # on saved models (in the MODEL_DIR), try making this value larger.
    VALIDATION_STEPS = 5

    # Matterport originally used resnet101, but I downsized to fit it on my graphics card
    BACKBONE = 'resnet50'

    # To be honest, I haven't taken the time to figure out what these do
    RPN_ANCHOR_SCALES = (8, 16, 32, 64, 128)
    TRAIN_ROIS_PER_IMAGE = 32
    MAX_GT_INSTANCES = 50
    POST_NMS_ROIS_INFERENCE = 500
    POST_NMS_ROIS_TRAINING = 1000


config = TableConfig()


class InferenceConfig(TableConfig):
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1
    IMAGE_MIN_DIM = 512
    IMAGE_MAX_DIM = 512
    DETECTION_MIN_CONFIDENCE = 0.85

inference_config = InferenceConfig()

# 모델 위치 설정!
WEIGHT_PATH ='/content/gdrive/MyDrive/capston/mask_rcnn/2021_05_28/mask_rcnn_table_0400.h5'
model = modellib.MaskRCNN(mode="inference",
                          config=inference_config,
                          model_dir=WEIGHT_PATH)
model.load_weights(WEIGHT_PATH, by_name=True)


# 테스트할 이미지 폴더 지정
def detect_table(dir):
    real_test_dir = dir
    image_paths = []
    for filename in os.listdir(real_test_dir):
        if os.path.splitext(filename)[1].lower() in ['.png', '.jpg', '.jpeg']:
            image_paths.append(os.path.join(real_test_dir, filename))

    for image_path in image_paths:
        img = skimage.io.imread(image_path)
        img_arr = np.array(img)
        results = model.detect([img_arr], verbose=1)
        r = results[0]
        visualize.display_instances(img, r['rois'], r['masks'], r['class_ids'],
                                    'Table', r['scores'], figsize=(10, 10))
        mask = r["masks"]
        rois = r['rois']
        image = cv2.imread(image_path)
        # cv2.imshow(image)
        for i in range(mask.shape[2]):
            img_filename = image_path.split(real_test_dir)[1]
            y_start, x_start, y_end, x_end = rois[i]
            crop_img = image[y_start - 3:y_end + 3, x_start - 3:x_end + 3]

            # 저장할 위치 지정
            filename = real_test_dir+"/Result/segment_" + img_filename + "%d.jpg" % i
            # cv2.imshow(crop_img)
            cv2.imwrite(filename, crop_img)
            image = cv2.rectangle(image, (x_start - 3, y_start), (x_end + 3, y_end), (255, 255, 255), -1)
        # cv2.imshow(image)

