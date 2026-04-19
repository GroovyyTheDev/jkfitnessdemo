"""Backend tests for JK Fitness leads API"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestRoot:
    """Root endpoint tests"""

    def test_root_returns_ok(self):
        r = requests.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"


class TestLeadsCreate:
    """POST /api/leads tests"""

    def test_create_lead_success(self):
        payload = {"name": "TEST_John Doe", "email": "test_john@example.com", "phone": "9876543210", "goal": "Lose weight", "source": "hero"}
        r = requests.post(f"{BASE_URL}/api/leads", json=payload)
        assert r.status_code == 201
        data = r.json()
        assert "id" in data
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["phone"] == payload["phone"]
        assert data["goal"] == payload["goal"]
        assert "_id" not in data

    def test_create_lead_missing_name(self):
        payload = {"email": "test@example.com", "phone": "9876543210"}
        r = requests.post(f"{BASE_URL}/api/leads", json=payload)
        assert r.status_code == 422

    def test_create_lead_missing_phone(self):
        payload = {"name": "Test User", "email": "test@example.com"}
        r = requests.post(f"{BASE_URL}/api/leads", json=payload)
        assert r.status_code == 422

    def test_create_lead_invalid_email(self):
        payload = {"name": "Test User", "email": "not-an-email", "phone": "9876543210"}
        r = requests.post(f"{BASE_URL}/api/leads", json=payload)
        assert r.status_code == 422

    def test_create_lead_missing_email(self):
        payload = {"name": "Test User", "phone": "9876543210"}
        r = requests.post(f"{BASE_URL}/api/leads", json=payload)
        assert r.status_code == 422

    def test_create_lead_optional_goal(self):
        payload = {"name": "TEST_No Goal", "email": "test_nogoal@example.com", "phone": "1234567890"}
        r = requests.post(f"{BASE_URL}/api/leads", json=payload)
        assert r.status_code == 201
        data = r.json()
        assert data["goal"] == ""


class TestLeadsList:
    """GET /api/leads tests"""

    def test_list_leads_returns_200(self):
        r = requests.get(f"{BASE_URL}/api/leads")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)

    def test_list_leads_no_id_field(self):
        r = requests.get(f"{BASE_URL}/api/leads")
        assert r.status_code == 200
        data = r.json()
        for lead in data:
            assert "_id" not in lead

    def test_list_leads_ordered_by_created_at_desc(self):
        # Create two leads in order and verify ordering
        p1 = {"name": "TEST_First", "email": "test_first@example.com", "phone": "1111111111"}
        p2 = {"name": "TEST_Second", "email": "test_second@example.com", "phone": "2222222222"}
        requests.post(f"{BASE_URL}/api/leads", json=p1)
        requests.post(f"{BASE_URL}/api/leads", json=p2)

        r = requests.get(f"{BASE_URL}/api/leads")
        assert r.status_code == 200
        data = r.json()
        if len(data) >= 2:
            # Latest should be first
            assert data[0]["created_at"] >= data[1]["created_at"]

    def test_create_and_verify_persistence(self):
        payload = {"name": "TEST_Persist Check", "email": "test_persist@example.com", "phone": "9999999999", "source": "test"}
        create_r = requests.post(f"{BASE_URL}/api/leads", json=payload)
        assert create_r.status_code == 201
        lead_id = create_r.json()["id"]

        list_r = requests.get(f"{BASE_URL}/api/leads")
        assert list_r.status_code == 200
        ids = [l["id"] for l in list_r.json()]
        assert lead_id in ids
