module.exports = {

  database: process.env.DATABASE || 'mongodb://root:Abc1234@ds163822.mlab.com:63822/frilla',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'frilla',

}
