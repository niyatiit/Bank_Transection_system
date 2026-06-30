import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "Account",
    required : [true , "Ledger must be associated with an account"],
    index : true,
    immutable : true, //one time entry is created you can not deleted and modify it 
  },
  amount : {
    type : Number,
    required : [true , "Amount is required for creating a ledger entry"],
    immutable : true,
  },
  transection : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Transection",
    required : [true, "Ledger must be associated with a transection"],
    index : true , 
    immuatable : true
  },
  type : {
    type : String ,
    enum : {
        values :["Credit" , "Debit"],
        message : "Type can be either Credit or Debit",
    },
    required : [true , "Ledger type is required"],
    immutable : true 
  }
});
 
const preventLedgerModification = () =>{
    throw new Error("Ledger entries are immutable and can not be modified or deleted")
}

//when you delete , remove , update any one then you don't update it because transection is not change after the one time put

ledgerSchema.pre('findOneAndUpdate' , preventLedgerModification)
ledgerSchema.pre('updateOne' , preventLedgerModification)
ledgerSchema.pre('deleteOne' , preventLedgerModification)
ledgerSchema.pre('remove' , preventLedgerModification)
ledgerSchema.pre('deleteMany' , preventLedgerModification)
ledgerSchema.pre('updateMany' , preventLedgerModification)
ledgerSchema.pre('findOneAndDelete' , preventLedgerModification)
ledgerSchema.pre('findOneAndReplace' , preventLedgerModification)

const ledgerModel = mongoose.model("Ledger", ledgerSchema);
export default ledgerModel;
