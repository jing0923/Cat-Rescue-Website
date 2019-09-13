var mongoose = require("mongoose");
var Cat = require("./models/cat");
var Comment = require("./models/comment");
 
var data = [
    {
        name: "Boots", 
        image: "https://kittenrescue.org/wp-content/uploads/2018/12/KittenRescue_Boots1.jpg",
        description: "Boots is an interesting character. She was in a home with someone until she was 7 years old and was then returned to Kitten Rescue when her human decided to move to a building that didn’t take pets. Boy oh boy, Boots did not take that move well. She acted feral and hissed and growled at everyone and for a long time we thought she hated other cats, too. She initially bonded very strongly with one of our caretakers. Recently she has taken to others and is able to be out and about with the other cats at the sanctuary, but she is still not very happy that they exist. Boots would love to have her own home again, ideally with a person who will take the time to let Boots adjust to a new home and preferably has no other cats."
    },
    {
        name: "Jackie", 
        image: "https://kittenrescue.org/wp-content/uploads/2019/01/KittenRescue_Jackie1.jpg",
        description: "Jackie is a gorgeous and curvy kitty who loves to be adored. Like Marilyn Monroe or Kate Upton, Jackie is proud of her curves and likes to show them off! She loves to be petted and is very playful. Her absolute MUST HAVE are little fluffy toy mice. Jackie’s other pleasure is lounging in the sunshine…imagining that she’s in a cute bikini on a beach in St. Tropez. Jackie doesn’t really like to share her humans, so it’s best if Jackie is the queen bee of her home.  You know the model types – they like to be the center of attention. Gorgeous, curvy, and lovable – Jackie has it all."
    },
    {
        name: "Rumble", 
        image: "https://kittenrescue.org/wp-content/uploads/2019/05/KittenRescue_Rumble1.jpg",
        description: "This sweet young boy has a purr that becomes a rumble when he’s content. Angel face, cute meow, soft fur, playful attitude, and smelling like butterscotch, there isn’t much he doesn’t have. Rumble was left behind when his family moved and really wants a new forever home. He needs to be the only male cat in the household and he doesn’t like dogs. He has a quiet voice when he talks and likes to sit next to you for pets. He’s playful and sweet and loves kisses too! Getting love is number 1 for this guy!"
    }
];
 
function seedDB(){
   Cat.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("DataBase is cleared!");
        // Comment.remove({}, function(err) {
        //     if(err){
        //         console.log(err);
        //     }
        //     console.log("removed comments!");
            
            data.forEach(function(seed){
                Cat.create(seed, function(err, cat){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a new cat");
                        //create a comment
                        Comment.create(
                            {
                                text: "This cat is so cute!!",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    cat.comments.push(comment);
                                    cat.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
 
}
 
module.exports = seedDB;