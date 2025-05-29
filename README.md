# 📚 MongoDB Bookstore Data Management

This repository contains scripts and instructions for managing a sample **bookstore database** using **MongoDB**. It includes a **Node.js script** to populate the database with sample book data, along with various **MongoDB queries** for data retrieval, manipulation, aggregation, and performance optimization through **indexing**.

## 📑 Table of Contents
- 📦 [Prerequisites](#prerequisites)
- ⚙️ [Setup](#setup)
- 🚀 [Running the Data Insertion Script](#running-the-data-insertion-script)
- 💡 [Running MongoDB Queries](#running-mongodb-queries)
  - Basic CRUD & Projection Queries
  - Aggregation Pipelines
  - Indexing

## 📦 Prerequisites
Ensure the following are installed:
- **Node.js**: https://nodejs.org/
- **MongoDB Community Server**: https://www.mongodb.com/try/download/community
- **MongoDB Compass** (optional): https://www.mongodb.com/products/compass
- `insert_books.js`: The provided script file.

## ⚙️ Setup
1. Save `insert_books.js` in a new folder (e.g., `my-bookstore-app`)
2. Open terminal and navigate to the folder:
   ```bash
   cd path/to/my-bookstore-app

## Initialize Node.js project:
npm init -y

## Install MongoDB Node.js driver:
npm install MongoDB


## Running the Data Insertion Script
Make sure MongoDB server (mongod) is running

Run the script:
node insert_books.js

You should see:
Connected to MongoDB server
12 books were successfully inserted into the database
Connection closed

Running MongoDB Queries
Use MongoDB Compass or the mongo shell.

## Basic CRUD & Projection Queries;
// Find all Fiction books

db.books.find({ genre: "Fiction" })

// Find books published after 1950

db.books.find({ published_year: { $gt: 1950 } })

// Find books by George Orwell
db.books.find({ author: "George Orwell" })

// Find books in stock and after 2010

db.books.find({ in_stock: true, published_year: { $gt: 2010 } })

// Update price of "The Great Gatsby"

db.books.updateOne({ title: "The Great Gatsby" }, { $set: { price: 11.99 } })

// Delete "Moby Dick"

db.books.deleteOne({ title: "Moby Dick" })

// Return title, author, price only

db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })

// Sort books by price (asc/desc)

db.books.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: 1 })
db.books.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: -1 })

// Pagination: 5 books per page

db.books.find({}, { title: 1, _id: 0 }).sort({ title: 1 }).skip(0).limit(5) // Page 1
db.books.find({}, { title: 1, _id: 0 }).sort({ title: 1 }).skip(5).limit(5) // Page 2

## Aggregation Pipelines
// Average price by genre

db.books.aggregate([
  { $group: { _id: "$genre", averagePrice: { $avg: "$price" } } },
  { $sort: { _id: 1 } }
])

// Author with most books

db.books.aggregate([
  { $group: { _id: "$author", bookCount: { $sum: 1 } } },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
])

// Group books by decade

db.books.aggregate([
  { $addFields: { decade: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } } },
  { $group: { _id: "$decade", bookCount: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])

## Indexing
// Create index on title

db.books.createIndex({ title: 1 })

// Compound index on author and year

db.books.createIndex({ author: 1, published_year: -1 })

// Use explain() to check index usage

db.books.find({ title: "1984" }).explain("executionStats")
db.books.find({ author: "George Orwell", published_year: { $gt: 1940 } }).explain("executionStats")

## SAMPLE DATA
![]([images/insert_script_output.png](https://github.com/Isaac-mutuma/week-1-mongodb-fundamentals-assignment-Isaac-mutuma/blob/main/screenshots/01.png))




