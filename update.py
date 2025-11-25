from flask import request, jsonify
from pymongo import ReturnDocument
from datetime import datetime

def updateUsers(userDB):
    # dictionary of food101 dataset
    food101_calories = {
        "apple_pie": 237, "baby_back_ribs": 292, "baklava": 428, "beef_carpaccio": 126,
        "beef_tartare": 190, "beet_salad": 43, "beignets": 452, "bibimbap": 173,
        "bread_pudding": 153, "breakfast_burrito": 206, "bruschetta": 150, "caesar_salad": 44,
        "cannoli": 340, "caprese_salad": 116, "carrot_cake": 415, "ceviche": 80,
        "cheese_plate": 350, "cheesecake": 321, "chicken_curry": 150, "chicken_quesadilla": 300,
        "chicken_wings": 290, "chocolate_cake": 371, "chocolate_mousse": 250, "churros": 447,
        "clam_chowder": 85, "club_sandwich": 221, "crab_cakes": 155, "creme_brulee": 340,
        "croque_madame": 250, "cup_cakes": 305, "deviled_eggs": 155, "donuts": 452,
        "dumplings": 160, "edamame": 122, "eggs_benedict": 277, "escargots": 90,
        "falafel": 333, "filet_mignon": 190, "fish_and_chips": 285, "foie_gras": 462,
        "french_fries": 312, "french_onion_soup": 70, "french_toast": 229, "fried_calamari": 175,
        "fried_rice": 168, "frozen_yogurt": 159, "garlic_bread": 350, "gnocchi": 130,
        "greek_salad": 106, "grilled_cheese_sandwich": 350, "grilled_salmon": 208, "guacamole": 160,
        "gyoza": 200, "hamburger": 295, "hot_and_sour_soup": 70, "hot_dog": 290,
        "huevos_rancheros": 210, "hummus": 166, "ice_cream": 207, "lasagna": 135,
        "lobster_bisque": 90, "lobster_roll_sandwich": 240, "macaroni_and_cheese": 210, "macarons": 412,
        "miso_soup": 40, "mussels": 86, "nachos": 310, "omelette": 154, "onion_rings": 411,
        "oysters": 68, "pad_thai": 160, "paella": 158, "pancakes": 227, "panna_cotta": 180,
        "peking_duck": 337, "pho": 80, "pizza": 266, "pork_chop": 231, "poutine": 277,
        "prime_rib": 294, "pulled_pork_sandwich": 275, "ramen": 130, "ravioli": 150,
        "red_velvet_cake": 367, "risotto": 166, "samosa": 262, "sashimi": 127,
        "scallops": 111, "seaweed_salad": 70, "shrimp_and_grits": 188, "spaghetti_bolognese": 170,
        "spaghetti_carbonara": 191, "spring_rolls": 154, "steak": 271, "strawberry_shortcake": 240,
        "sushi": 130, "tacos": 226, "takoyaki": 210, "tiramisu": 283, "tuna_tartare": 144,
        "waffles": 291
    }

    try:
        data = request.get_json()
        name = data.get("name")
        updates = data.get("updates", {})
        
        if not name:
            return jsonify({"error": "Name required"}), 400
        
        existing_user = userDB.find_one({"name": name})
        if not existing_user:
            return jsonify({"error": "User not found"}), 404


        # The frontend sends a comma-separated string for the current day's log
        initial_food_input = updates.pop("today_food_intake", None) 
        
        if initial_food_input is not None:
            total_calories_consumed = 0
            food_log_entries = []
            
            food_list = [f.strip().lower() for f in initial_food_input.split(',') if f.strip()]
            
            for food_name in food_list:
                calories = food101_calories.get(food_name, 0)
                
                if calories > 0:
                    total_calories_consumed += calories
                    # Recreate the structured log entry for the current time
                    food_log_entry = {
                        "foodname": food_name, "quantity": 1, "calories": calories,
                        "timestamp": datetime.now().isoformat()
                    }
                    food_log_entries.append(food_log_entry)
            
            # Add the recalculated food fields to the updates dictionary
            updates["total_calories"] = total_calories_consumed
            updates["today_food"] = food_log_entries


        try:
            # Use new values from updates, or existing values if not provided
            weight = float(updates.get("weight", existing_user.get("weight")))
            height = float(updates.get("height", existing_user.get("height")))
            age = float(updates.get("age", existing_user.get("age")))
            gender = updates.get("gender", existing_user.get("gender"))
            activity = updates.get("activity_level", existing_user.get("activity_level"))
        except (TypeError, ValueError) as e:
            print(f"Data conversion error during metric calculation: {e}")
            return jsonify({"error": "Invalid data format for weight, height, or age."}), 400

        # Recalculate BMR/TDEE only if core metrics are present
        if weight and height and age and gender and activity:
            if gender.lower() == "male":
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
            else:
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
                
            activity_factors = {
                "Sedentary": 1.2, "Lightly Active": 1.375, "Moderately Active": 1.55, 
                "Very Active": 1.725, "Super Active": 1.9, "Extremely Active": 1.9,
            }
            
            tdee = bmr * activity_factors.get(activity, 1.2)
            
            updates["bmr"] = round(bmr, 2)
            updates["tdee"] = round(tdee, 2)
            updates["daily_calorie_target"] = int(round(tdee)) 

        # 3. Update the document in MongoDB
        updated_user = userDB.find_one_and_update(
            {"name": name},
            {"$set": updates},
            return_document=ReturnDocument.AFTER
        )
        
        if not updated_user:
            return jsonify({"error": "User not found"}), 404
        
        updated_user["_id"] = str(updated_user["_id"])
        updated_user.pop("password", None) 

        return jsonify({
            "message": "User updated",
            "user": updated_user
        }), 200

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Server error"}), 500