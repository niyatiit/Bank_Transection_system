import accountModel from "../models/account.model.js";

const createAccountController = async (req, res) => {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });

  return res.json({
    success: true,
    message: "Account is created successfully",
    account,
  });
};

const getUsersAccountsController = async (req, res) => {
  const accounts = await accountModel.find({ user: req.user._id });

  const accountsWithBalance = await Promise.all(
    accounts.map(async (account) => {
      const balance = await account.getBalance();
      return {
        ...account.toObject(),
        balance,
      };
    })
  );


  return res.json({
    success: true,
    message: "fetch All the users : ",
    accounts : accountsWithBalance
  });
};

const getAccountBalanceController = async (req, res) => {
  const { accountId } = req.params;
  // console.log(accountId);
  

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
    
  });

  if (!account) {
    return res.json({
      success: false,
      message: "Account is not found",
    });
  }

  const balance = await account.getBalance();
  // console.log("Account Id : ",accountId , " and balance is : " , balance);
  

  return res.json({
    success: true,
    message: "Total Balance : ",
    balance : balance,
    accountId : account._id
  });
};
export {
  createAccountController,
  getUsersAccountsController,
  getAccountBalanceController,
};
