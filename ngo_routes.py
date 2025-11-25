from flask import request, jsonify
import re

def ngo_map(ngo_collection):
    state = request.args.get('state', '').strip()
    city = request.args.get('city', '').strip()

    if not state and not city:
        return jsonify({"error": "Enter state or city"}), 400

    query = {}

    if state and city:
        query = {
            "state": {"$regex": re.compile(state, re.IGNORECASE)},
            "address": {"$regex": re.compile(city, re.IGNORECASE)}
        }

    elif city:
        query = {
            "address": {"$regex": re.compile(city, re.IGNORECASE)}
        }

    elif state:
        query = {
            "state": {"$regex": re.compile(state, re.IGNORECASE)}
        }

    results = list(ngo_collection.find(query, {"_id": 0}))
    print("NGO SEARCH API WORKING")
    return jsonify(results)
