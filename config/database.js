if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://xilionk:Seifer184.@ds229878.mlab.com:29878/vidjot-prod'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}