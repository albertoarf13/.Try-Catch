const controller = {};

controller.list = (req, res)=>{

    req.getConnection((err, conn)=>{
        conn.query('SELECT * FROM customer', (err, customers)=>{
            
            if(err){
                res.json(err);
            }
            
            //res.json(rows);
            console.log(customers);

            res.render('customers', {
                data: customers
            })
        })
    });
};

controller.add = (req, res) =>{


    req.getConnection((err, conn)=>{

        conn.query('insert into customer set ?;', [req.body], (err, customer)=>{
            
            if(err){
                res.json(err);
            }
            
            console.log(customer);
            res.redirect('/');

        })
    });

}


module.exports = controller;