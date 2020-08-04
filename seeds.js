const mongoose   = require('mongoose'),
      Restaurant = require('./models/restaurant'),
      Comment    = require('./models/comment');

data = [
  {
    name: "Sam's Cafe",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus viverra, lacus eu eleifend pretium, tortor velit accumsan tortor, ut aliquam ante lorem eu dui. Vivamus at feugiat eros."
  },
  {
    name: "Moti Mahal",
    image: "https://images.unsplash.com/photo-1573668200361-62e141908294?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "Vestibulum dignissim purus a dui feugiat, vitae euismod ipsum feugiat. Cras viverra a mauris quis pulvinar."
  },
  {
    name: "Friends Corner",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    description: "Curabitur luctus congue mauris at congue. Aenean a venenatis orci, facilisis dignissim leo."
  }
];


function seedDB(){
   //Remove all restaurants
   Restaurant.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed restaurants!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few restaurants
            data.forEach(function(seed){
                Restaurant.create(seed, function(err, restaurant){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a restaurant");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    restaurant.comments.push(comment);
                                    restaurant.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    });
    //add a few comments
}

module.exports = seedDB;
