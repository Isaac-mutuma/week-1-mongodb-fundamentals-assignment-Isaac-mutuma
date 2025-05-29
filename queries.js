// Find all books in the 'Fiction' genre
db.books.find({ genre: "Fiction" })

// Find all books published after 1950
db.books.find({ published_year: { $gt: 1950 } })

// Find all books by George Orwell
db.books.find({ author: "George Orwell" })

// Update the price of "The Great Gatsby" to 11.99
db.books.updateOne(
  { title: "The Great Gatsby" },
  { $set: { price: 11.99 } }
)

// Delete a book by its title
db.books.deleteOne({ title: "Moby Dick" })

//Task 3: Advanced Queries
//find books that are both in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } })

//Return only the title, author, and price for all books.
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
)

//Display all books sorted by price in ascending order.
db.books.find().sort({ price: 1 })

//Get the first 5 books (Page 1), showing only title, author, and price, sorted by title (ascending).
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
)
.sort({ title: 1 }) // Sorting is typically applied before skipping/limiting for consistent results
.skip(0)
.limit(5)

//Get the next 5 books (Page 2), showing only title, author, and price, sorted by title (ascending).
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
)
.sort({ title: 1 })
.skip(5) // Skips the first 5 results
.limit(5) // Returns the next 5 results

//Find books in the 'Fiction' genre, return title, author, price, sorted by price descending, for the first 5 results.
db.books.find(
  { genre: "Fiction" }, // Your query criteria
  { title: 1, author: 1, price: 1, _id: 0 } // Projection
)
.sort({ price: -1 }) // Sort by price descending
.skip(0) // Start from the beginning (Page 1)
.limit(5) // Get 5 results


// Task 4: Aggregation Pipeline
//Calculate the Average Price of Books by Genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre", // Group documents by the 'genre' field
      averagePrice: { $avg: "$price" } // Calculate the average of the 'price' field for each group
    }
  },
  {
    $sort: {
      _id: 1 // Optional: Sort the results by genre name in ascending order for readability
    }
  }
])

// Find the Author with the Most Books in the Collection
db.books.aggregate([
  {
    $group: {
      _id: "$author", // Group documents by the 'author' field
      bookCount: { $sum: 1 } // Count the number of books for each author
    }
  },
  {
    $sort: {
      bookCount: -1 // Sort authors by their book count in descending order
    }
  },
  {
    $limit: 1 // Limit the result to only the top author (the one with the most books)
  }
])

//Group Books by Publication Decade and Count Them
db.books.aggregate([
  {
    $addFields: {
      // Calculate the decade for each book
      decade: {
        $multiply: [
          { $floor: { $divide: ["$published_year", 10] } }, // Divide by 10, floor, then multiply by 10
          10
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade", // Group documents by the calculated 'decade'
      bookCount: { $sum: 1 } // Count the number of books in each decade
    }
  },
  {
    $sort: {
      _id: 1 // Sort the results by decade in ascending order
    }
  }
])

//Task 5: Indexing
//Create an Index on the title field for Faster Searches
db.books.createIndex({ title: 1 })

// Create a Compound Index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 })

//Use explain() to Demonstrate Performance Improvement
db.books.find({ title: "1984" }).explain("executionStats")

//Demonstrating Compound Index Performance (author and published_year)
db.books.find({ author: "George Orwell", published_year: { $gt: 1940 } }).explain("executionStats")