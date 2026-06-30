import mongoose from "mongoose";
import ledgerModel from "./ledger.model.js";

const accountSchema = new mongoose.Schema({
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true , "Account must be associated with a user"],
        index : true, //searching speed is fast 
    },
    status : {
        type : String,
        enum : {
            values : ["Active" , "Frozen" , "Closed"],
            message : "Status can be either Active , Frozen or Closed",
        },
        default : "Active"
    },
    currency : {
        type : String , 
        required : [true , "Currency is required for creating an account"],
        default : "INR",
    }
},{
    timestamps : true
})

//compound index
accountSchema.index({user : 1 ,status :1})


//aggregagate is custome pipline use by the mongoodb 
accountSchema.methods.getBalance = async function(){

    //this function is usefull when both side of account is continue means not create one latest like not create new account  
    // console.log("Account ID : " , this._id)
    const balanceData = await ledgerModel.aggregate([
        {
            $match : {account :this._id}
        },
        {
            $group : {
                _id : null,
                totalDebit : {
                    $sum : {
                        $cond : [
                            {$eq : ["$type" , "Debit"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit : {
                    $sum : {
                        $cond : [
                            {$eq : ["$type" , "Credit"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project : {
                _id : 0,
                balance : {
                    $subtract : ["$totalCredit" , "$totalDebit"]
                }
            }
        }
    ])


    // now this is for the new latest account senario

    if(balanceData.length === 0)
    {
        return 0
    }

    return balanceData[0].balance
}

const accountModel =  mongoose.model("Account" , accountSchema)

export default accountModel