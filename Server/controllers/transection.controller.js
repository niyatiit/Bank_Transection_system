import mongoose from "mongoose";
import accountModel from "../models/account.model.js";
import transectionModel from "../models/transection.model.js";
import ledgerModel from "../models/ledger.model.js";
import { sendTransectionEmail } from "../services/email.service.js";

/*
------> Create the new transection 
    1. Validate Request
    2. Validate idempotency key
    3. check account status
    4. Derive sender balance from ledger
    5. Create transection [pending]
    6. Create debit ledger entry
    7. Create credit ledger entry
    8. Mark Transection session
    9. Commit mongoDB session
    10. Send Email notification

*/
const createTransection = async (req, res) => {
  //validate request only
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.json({ success: false, message: "All Fields are requierd " });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.json({
      success: false,
      message: "Invalid Account ",
    });
  }

  //validate idempontency key

  const isTransectionAlreadyExists = await transectionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransectionAlreadyExists) {
    if (isTransectionAlreadyExists.status === "Completed") {
      return res.json({
        success: true,
        message: "Transection already processd",
        Transection: isTransectionAlreadyExists,
      });
    }
    if (isTransectionAlreadyExists.status === "Pending") {
      return res.json({
        success: false,
        message: "Transection is still proccing",
      });
    }

    if (isTransectionAlreadyExists.status === "Faield") {
      return res.json({
        success: false,
        message: "Transection proccing is failed",
      });
    }

    if (isTransectionAlreadyExists.status === "Reversed") {
      return res.json({
        success: false,
        message: "Transection was reversed please try again",
      });
    }
  }

  // check account status :- only open then use otherwise not
  // when both account is active means fromAccount and toAccount both are active then go to the successfully transection otherwise not

  if (fromUserAccount.status != "Active" || toUserAccount.status != "Active") {
    return res.json({
      success: false,
      message: "Both Account is closed so transection is not possible ",
    });
  }

  //Derive sender balance from ledger
  //using the aggrigation pipeline

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.json({
      success: false,
      message: `Insufficient balance. current balance is ${balance} . Requested amount is ${amount}`,
    });
  }

  let transection;
  // Create Transection (Pending)

  // startSession is mongoodb part if all the transection is completed then done this sesstion otherwise not and not then all the transection is reversed means that pending , debit and credit is not completed untill not successfully done
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    transection = (
      await transectionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "Pending",
          },
        ],
        { session },
      )
    )[0];

    const debitLedgerEntry = await ledgerModel.create(
      {
        account: fromAccount,
        amount: amount,
        transection: transection._id,
        type: "Debit",
      },
      { session },
    );

    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
    })();

    const creditLedgerEntry = await ledgerModel.create(
      {
        account: toAccount,
        amount: amount,
        transection: transection._id,
        type: "Credit",
      },
      { session },
    );

    const updatedTransection = await transectionModel.findOneAndUpdate(
      { _id: transection._id },
      { status: "Completed" },
      { session , new : true},
    );

    console.log(updatedTransection);
    
    

    // transection.status = "Completed"
    // await transection.save({session})

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }

  // send email notificaton

  await sendTransectionEmail(req.user.email, req.user.name, amount, toAccount);

  return res.json({
    success: true,
    message: "Transection is completed successfully",
    transection: transection,
  });
};

const createInitialFundsTransection = async (req, res) => {
  const { toAccount, amount, idempontencyKey } = req.body;

  // console.log("To Account : " ,toAccount)
  // console.log("To Amount : " ,amount)
  // console.log("To IdempontencyKey  : " ,idempontencyKey)

  if (!toAccount || !amount || !idempontencyKey) {
    return res.json({
      success: false,
      message: "toAccount , amount and idempontecy key are required",
    });
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!toUserAccount) {
    return res.json({
      success: false,
      message: "Invalid toAccount",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    // systemUser : true,
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.json({
      success: false,
      message: "System User Account is not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transection = new transectionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempontencyKey,
    status: "Pending",
  });

  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        amount: amount,
        transection: transection._id,
        type: "Debit",
      },
    ],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toAccount,
        amount: amount,
        transection: transection._id,
        type: "Credit",
      },
    ],
    { session },
  );

  transection.status = "Completed";
  await transection.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.json({
    success: true,
    message: "Transection is completed successfully",
    transection: transection,
  });
};
export { createTransection, createInitialFundsTransection };
