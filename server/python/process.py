import sys
import numpy as np
from keras.models import load_model
import keras.utils as image
model = load_model('./server/python/kidney_stone_detection_model.h5')
image_name = sys.argv[1]

img = f'./uploads/{image_name}'
test_img = image.load_img(img, target_size=(150, 150))
test_img = image.img_to_array(test_img)
test_img = np.expand_dims(test_img, axis=0)
result = model.predict(test_img)
if result[0][0] == 1:
    print(1)
elif result[0][0] == 0:
    print(0)
