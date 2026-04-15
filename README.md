# JDM Registry

A MongoDB-powered Node.js web app for cataloguing JDM and sports cars.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB via Mongoose
- **Containerization**: Podman / Docker

---

## Car Document Schema

| Field        | Type   | Description                        |
|--------------|--------|------------------------------------|
| `make`       | String | Manufacturer (e.g. Nissan)        |
| `model`      | String | Model name (e.g. 350Z)            |
| `year`       | Number | Production year (e.g. 2003)       |
| `horsepower` | Number | Engine output in HP (e.g. 287)    |
| `engine`     | String | Engine code/description            |
| `drivetrain` | String | RWD / FWD / AWD / 4WD            |
| `dateAdded`  | Date   | Auto-set timestamp when created   |

---

## Page Routes

| Path      | Description                              |
|-----------|------------------------------------------|
| `/`       | Landing page with live car count         |
| `/upload` | Form to add a new car to the registry   |
| `/list`   | Table of all cars sorted by newest first |
| `/query`  | AJAX search/filter form                  |

---

## REST API Routes

### POST `/car`
Create a new car document.

**Request body (JSON):**
```json
{
  "make": "Nissan",
  "model": "350Z",
  "year": 2003,
  "horsepower": 287,
  "engine": "VQ35DE 3.5L V6",
  "drivetrain": "RWD"
}
```

**Response:**
```json
{
  "success": true,
  "car": { "_id": "...", "make": "Nissan", ... }
}
```

---

### GET `/cars`
Query the car collection with optional filters. Results sorted by horsepower ascending.

**Query Parameters:**

| Param        | Type   | Description                        |
|--------------|--------|------------------------------------|
| `maxHp`      | Number | Filter cars with HP ≤ this value  |
| `minYear`    | Number | Filter cars with year ≥ this value |
| `make`       | String | Case-insensitive partial match     |
| `drivetrain` | String | Exact match: RWD, FWD, AWD, 4WD  |

**Example Queries:**

```
GET /cars                          → all cars sorted by HP
GET /cars?maxHp=300                → cars with ≤300 HP
GET /cars?make=honda               → all Hondas
GET /cars?drivetrain=RWD           → rear-wheel drive only
GET /cars?maxHp=400&minYear=2000   → ≤400HP built since 2000
GET /cars?make=toyota&drivetrain=AWD
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "cars": [ { ... }, { ... } ]
}
```

---

### GET `/api/cars/all`
Returns all cars sorted by `dateAdded` descending. Used by `/list`.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start MongoDB (requires local MongoDB or Docker)
# Then:
node server.js
```

App runs at `http://localhost:3000`

---

## Deployment with Podman

1. SSH into `pdmn.cs.nmsu.edu`
2. Clone this repo
3. Edit `docker-compose.yml` — replace `XXXX` with your assigned port number
4. Build and start:

```bash
podman-compose up -d --build
```

5. Visit `https://<your-cs-username>.cs382.net`

---

## Example curl Commands

```bash
# Add a car
curl -X POST http://localhost:3000/car \
  -H "Content-Type: application/json" \
  -d '{"make":"Honda","model":"S2000","year":2004,"horsepower":240,"engine":"F20C 2.0L VTEC","drivetrain":"RWD"}'

# Query all RWD cars under 300hp
curl "http://localhost:3000/cars?drivetrain=RWD&maxHp=300"

# Query all Subarus from 2002 onward
curl "http://localhost:3000/cars?make=subaru&minYear=2002"
```
