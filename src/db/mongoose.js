const mongoose = require("mongoose");



mongoose.connect(process.env.URL_DATA_BASE, {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
});



// const me = new User({
//     name: "Mahdi",
//     email: "mahdi@GAMIAL.COM",
//     password: "mahdi "

// })

// me.save().then(() => {
//     console.log(me)
// }).catch((err) => {
//     console.log(err, 'Error')
// });