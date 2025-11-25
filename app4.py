from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime 

def reset_daily_data(users_collection, user_email):
    """Checks if a new day has started since the last login/reset and clears daily data."""
    user = users_collection.find_one({"email": user_email})
    
    lastReset = user.get("last_reset_date")
    needReset = False
    currDate = datetime.now().date()

    if lastReset:
        try:
            last_reset_date = datetime.fromisoformat(lastReset).date()
            if last_reset_date < currDate:
                needReset = True
        except ValueError:
            needReset = True
    else:
        needReset = True
        
    if needReset:
        users_collection.update_one(
            {"email": user_email},
            {
                "$set": {
                    "today_food": [],
                    "total_calories": 0,
                    "last_reset_date": datetime.now().isoformat()
                }
            }
        )
        return users_collection.find_one({"email": user_email})
    
    return user



def signup(users):
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

        req = ["name", "email", "password", "age", "gender", "weight", "height"] # must columns
        err = {f: "Required" for f in req if not data.get(f)}

        if err:
            return jsonify({"error": err}), 400

        if users.find_one({"email": data["email"]}):
            return jsonify({"error": {"email": "Email already exists"}}), 400

        hashed = generate_password_hash(data["password"]) 
        
        weight = float(data["weight"])
        height = float(data["height"])
        age = float(data["age"])

        if data["gender"].lower() == "male":
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
        else:
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161

        # caculating tdee
        activity_factors = {
            "Sedentary": 1.2,
            "Lightly Active": 1.375,
            "Moderately Active": 1.55,
            "Very Active": 1.725,
            "Super Active": 1.9
        }

        tdee = bmr * activity_factors.get(data.get("activity_level", "Sedentary"), 1.2)
        dailyTarget = int(round(tdee))
        

        consumed_cal = 0
        foodEntry = []
        
        initial_food_input = data.get("today_food_intake", "") 
        
        if initial_food_input:
            food_list = [f.strip().lower() for f in initial_food_input.split(',')]
            
            for food_name in food_list:
                calories = food101_calories.get(food_name, 0)
                
                if calories > 0:
                    consumed_cal += calories
                    food_log_entry = {
                        "foodname": food_name,
                        "quantity": 1,
                        "calories": calories,
                        "timestamp": datetime.now().isoformat()
                    }
                    foodEntry.append(food_log_entry)


        user_data = {
            "name": data["name"],
            "email": data["email"],
            "password": hashed,
            "age": data["age"],
            "gender": data["gender"],
            "weight": data["weight"],
            "height": data["height"],
            "activity_level": data.get("activity_level", "Sedentary"),
            "goal": data.get("goal", ""),
            "bmr": round(bmr, 2), 
            "tdee": round(tdee, 2), 
            "daily_calorie_target": dailyTarget,
            "today_food": foodEntry, 
            "total_calories": consumed_cal, 
            "last_reset_date": datetime.now().isoformat()
        }

        users.insert_one(user_data)

        return jsonify({"message": "Signup successful", "total_calories": consumed_cal}), 200

    except Exception as e:
        print("Signup error:", e)
        return jsonify({"error": "Server error"}), 500
    

# login page
def login(users):
    try:
        data = request.get_json()
        print("Login attempt:", data)

        name = data.get("name", "").strip()#username
        password = data.get("password", "")

        if not name or not password:
            return jsonify({"err": {"name": "Enter name", "password": "Enter password"}}), 400

        user = users.find_one({"name": name})
        if not user:
            return jsonify({"err": {"name": "User not found"}}), 404
        
        # We also need the email for the reset function
        user_email = user.get("email")

        if not check_password_hash(user["password"], password):
            return jsonify({"err": {"password": "Incorrect password"}}), 400


        if user_email:
             user = reset_daily_data(users, user_email)
        
        
        user["_id"] = str(user["_id"])

        return jsonify({
            "message": "Logged in",
            "user": user
        }), 200

    except Exception as e:
        print("Login error:", e)
        return jsonify({"error": "Server error"}), 500


