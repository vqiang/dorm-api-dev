const Item = require('../models/schemas/item')


exports.createItem = (req, res) => {
  if (!req.body.userId) {
    return res.status(400).send('Must provide userid')
  }
  Item.findById(req.body.userId, (err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.status(400).send('No user with id: ' + req.body.userId)
    if (user.isAdmin == 'false') return res.status(400).send('Youre not an admin')
  })
  if (!req.body.name) {
    return res.status(400).send('Must provide name')
  }
  if (!req.body.price) {
    return res.status(400).send('Must provide price')
  }
  if (!req.body.quantity) {
    return res.status(400).send('Must provide quantity')
  }
  const itemData = {
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity
  }
  const newItem = new Item(itemData)
  newItem.save((err) => {
    if (err) return res.status(500).send('Could not create')
    return res.json(newItem)
  })
}

exports.getAllItems = (req, res) => {
  Item.find({}, (err, items) => {
    if (err) return res.status(500).send('Error: ' + err)
    return res.json(items)
  })
}

exports.getItemById = (req, res) => {
  Item.findById(req.params.itemId, (err, item) => {
    if (err) return res.sendStatus(500)
    if (!item) return res.status(400).send('No item with id: ' + req.params.itemId)
    return res.json(item)
  })
}
exports.updateItem = (req, res) => {
  if (!req.body.userId) {
    return res.status(400).send('Must provide userid')
  }
  Item.findById(req.body.userId, (err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.status(400).send('No user with id: ' + req.body.userId)
    if (user.isAdmin == 'false') return res.status(400).send('Youre not an admin')
  })
  Item.findByIdAndUpdate({ _id: req.params.itemId }, req.body, {}, (err, item) => {
    if (err) return res.sendStatus(500)
    if (!item) return res.status(404).send('Could not find item: ' + req.params.itemId)
    return res.json(item)
  })
}

exports.deleteItem = (req, res) => {
  if (!req.body.userId) {
    return res.status(400).send('Must provide userid')
  }
  Item.findById(req.body.userId, (err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.status(400).send('No user with id: ' + req.body.userId)
    if (user.isAdmin == 'false') return res.status(400).send('Youre not an admin')
  })
  Item.findByIdAndRemove(req.params.itemId, (err, item) => {
    if (err) return res.sendStatus(500)
    if (!item) return res.status(404).send('Could not find item ' + req.params.itemId)
    return res.json(item)
  })
}

exports.purchaseItem = (req, res) => {
  const now = new Date()
  if (!req.body.userId) {
    return res.status(400).send('Must provide userid')
  }
  if (!req.body.quantity) {
    return res.status(400).send('Must provide quantity')
  } 
  Item.findById(req.body.userId, (err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.status(400).send('No user with id: ' + req.body.userId)
    if (user.isAdmin == 'true') return res.status(400).send('Youre not a customer')
    Item.findByIdAndUpdate({ _id: req.params.itemId }, { $inc: { quantity: - req.body.quantity } }, {}, (err2, item) => {
      if (err2) return res.sendStatus(500)
      if (!item) return res.status(404).send('Could not find item: ' + req.params.itemId)
      Item.findById(req.params.itemId, (err3, item3) => {
        if (err3) return res.sendStatus(500)
        if (!item3) return res.status(400).send('No item with id: ' + req.params.itemId)
        User.findById(req.body.userId, (err2, user) => {
          if (err2) return res.sendStatus(500)
          if (!user) return res.status(400).send('No user with id: ' + req.params.userId)
          user.orders = [{
            items: [{
              itemId: req.param.itemId,
              quantity: { $inc: { quantity: req.body.quantity } },
              price: item.price,
            }],
            purchasedDate: now,
            //deliveredDate: Date,
            isPaid: true
          }]
          return res.json(item3)
        })    
      })
    })
  })

}
/*
exports.createCoupon = (req, res, next) => {
  const props = ['name', 'description', 'url', 'startDate', 'endDate']
  props.forEach((prop) => {
    if (!req.body[prop] return res. status()
  )}
  const couponData = {
    name: req.body.name,
    description: req.body.description,
    isApproved: false,
    url: req.body.url,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    businessId: req.body.businessId
  }
  const newCoupon = new Coupon(couponData)
  newCoupon.save((err)=> {
    if (err) return next(err)
    return res.json(newCoupon)
  })
}
exports.getActiveCoupons = (req, res, next) => {
  const now = new Date()
  Coupon.find ({
    $and: [
      { startDate: { $exists: true } },
      { startDate: { $lt: now } },
      { andDate: { $gt: now } }
    ]
  })
}
*/