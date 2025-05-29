MongoDB Bookstore Data Management
This repository contains scripts and instructions for managing a sample bookstore database in MongoDB. It includes a Node.js script to populate the database with sample book data and various MongoDB queries for data retrieval, manipulation, and performance optimization using aggregation pipelines and indexing.

Table of Contents
Prerequisites

Setup

Running the Data Insertion Script

Running MongoDB Queries

Basic CRUD & Projection Queries

Aggregation Pipelines

Indexing

Prerequisites
Before you begin, ensure you have the following installed on your system:

Node.js: Download & Install Node.js (includes npm, the Node.js package manager).

MongoDB Community Server: Download & Install MongoDB Community Server

MongoDB Compass (Optional but Recommended): A GUI tool for MongoDB. Download MongoDB Compass

Your insert_books.js file: The Node.js script provided earlier.

Setup
Save the Script: Save the provided Node.js script (from the previous conversation) as insert_books.js in a new folder (e.g., my-bookstore-app).

Open Command Prompt/Terminal:
Navigate to the directory where you saved insert_books.js using your command prompt (CMD on Windows) or terminal (macOS/Linux).

cd path\to\your\my-bookstore-app

(Replace path\to\your\my-bookstore-app with the actual path to your folder).

Initialize Node.js Project:
If this is a new folder, you need to initialize a Node.js project to manage dependencies.

npm init -y

Install MongoDB Node.js Driver:
Install the official MongoDB driver for Node.js, which your script uses to connect to the database.

npm install mongodb

Running the Data Insertion Script
This script will connect to your local MongoDB server, create (or clear and re-create) the plp_bookstore database and books collection, and then insert the sample book data.

Ensure MongoDB Server is Running:
Make sure your MongoDB server (mongod.exe on Windows) is running in the background. If you installed it as a service, it should start automatically. Otherwise, you might need to start it manually.

Execute the Script:
In your Command Prompt/Terminal, from the project directory:

node insert_books.js

You should see output similar to this:

Connected to MongoDB server
Collection already contains X documents. Dropping collection... (if applicable)
Collection dropped successfully (if applicable)
12 books were successfully inserted into the database

Inserted books:
1. "To Kill a Mockingbird" by Harper Lee (1960)
... (list of books)
Connection closed

After running this, your plp_bookstore database will contain the books collection populated with the sample data.

Running MongoDB Queries
You can execute these queries using MongoDB Compass's built-in shell or the mongo shell if you have it installed.

Basic CRUD & Projection Queries
To run these:

Open MongoDB Compass and connect to your MongoDB instance (e.g., mongodb://localhost:27017).

Navigate to the plp_bookstore database and then the books collection.

Go to the "Aggregations" tab (for pipelines) or "Documents" tab and use the "Filter" or "Projection" options, or click "Open Shell" to type queries directly.

Find all books in a specific genre (e.g., 'Fiction'):

db.books.find({ genre: "Fiction" })

Find books published after a certain year (e.g., 1950):

db.books.find({ published_year: { $gt: 1950 } })

Find books by a specific author (e.g., 'George Orwell'):

db.books.find({ author: "George Orwell" })

Find books that are both in stock and published after 2010:

db.books.find({ in_stock: true, published_year: { $gt: 2010 } })

Update the price of a specific book (e.g., "The Great Gatsby" to 11.99):

db.books.updateOne(
  { title: "The Great Gatsby" },
  { $set: { price: 11.99 } }
)

Delete a book by its title (e.g., "Moby Dick"):

db.books.deleteOne({ title: "Moby Dick" })

Return only the title, author, and price fields for all books (Projection):

db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
)

Display all books sorted by price (ascending):

db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: 1 })

Display all books sorted by price (descending):

db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: -1 })

Implement pagination (5 books per page - Page 1 example):

db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
)
.sort({ title: 1 }) // Always sort before skipping/limiting for consistent pages
.skip(0) // For Page 1, skip 0
.limit(5) // Limit to 5 books

(For Page 2, change skip(0) to skip(5), for Page 3 to skip(10), and so on.)

Aggregation Pipelines
These queries are best run in the "Aggregations" tab of MongoDB Compass, where you can build and visualize the pipeline stages.

Calculate the average price of books by genre:

db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  },
  {
    $sort: {
      _id: 1
    }
  }
])

Find the author with the most books in the collection:

db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: {
      bookCount: -1
    }
  },
  {
    $limit: 1
  }
])

Group books by publication decade and count them:

db.books.aggregate([
  {
    $addFields: {
      decade: {
        $multiply: [
          { $floor: { $divide: ["$published_year", 10] } },
          10
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: {
      _id: 1
    }
  }
])

Indexing
Indexes significantly speed up query performance. You can create these indexes in MongoDB Compass (under the "Indexes" tab for a collection) or directly in the shell.

Create an index on the title field:

db.books.createIndex({ title: 1 })

Create a compound index on author and published_year:

db.books.createIndex({ author: 1, published_year: -1 })

Demonstrate performance improvement with explain():
After creating the indexes, run your queries with .explain("executionStats") appended to see how MongoDB uses the indexes. Look for IXSCAN in the winningPlan stage.

Example explain() for title index:

db.books.find({ title: "1984" }).explain("executionStats")

(Look for "stage": "IXSCAN" in the output)

Example explain() for compound index:

db.books.find({ author: "George Orwell", published_year: { $gt: 1940 } }).explain("executionStats")

(Look for "stage": "IXSCAN" in the output)

This README.md provides a comprehensive guide to setting up and interacting with your MongoDB bookstore data.
