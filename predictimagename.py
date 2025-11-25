from flask import request, jsonify
import os, numpy as np
from tensorflow.keras.preprocessing import image
import tensorflow as tf

def predictingfoodnamefrom_image(model, collection, labels):
    print("predicting image name")
    def predict_food(img_path):
      print("loading and converting dim")
      img = image.load_img(img_path, target_size=(224, 224))
      x = image.img_to_array(img)
      x = np.expand_dims(x, axis=0) / 255.0

      print("predicting name from model")
      pred = model.predict(x)
      if pred.shape[-1] > 1:
          pred = tf.nn.softmax(pred) # softmax neural network 
      pred_class_idx = int(np.argmax(pred))
      pred_name = labels[str(pred_class_idx)]
      return pred_name

    print("checking correctness of image")
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    print("detecting image")
    file = request.files['image']
    temp_path = "temp_image.png"
    file.save(temp_path)

    try:
        print("food name")
        pred_name = predict_food(temp_path)
        food = pred_name.upper()
        khana = ""
        for i in food:
            if i == "_":
                khana += " "
            else:
                khana += i;
        print(f"So the food we captured from your image is , \033[33m{khana}\033[0m")
        
        print("now fetching details from db")
        food_db = collection.find_one({"foodname": pred_name})

        if not food_db:
            return jsonify({
                "predicted_food": pred_name,
                "message": "No food in DB"
            })

        food_db.pop("_id", None)

        print("returning all info in json")
        return jsonify({
            "predicted_food": pred_name,
            "details": food_db
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
