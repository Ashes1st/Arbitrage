pragma solidity ^0.6.0;

interface IBEP20 {
    function totalSupply() external view returns (uint256);
    function decimals() external view returns (uint8);
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function getOwner() external view returns (address);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address _owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface IPancakeswap {
    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);
        
        
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
      external
      payable
      returns (uint[] memory amounts);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
    
  function swapTokensForExactTokens(
      uint amountOut,
      uint amountInMax,
      address[] calldata path,
      address to,
      uint deadline
    ) external returns (uint[] memory amounts);
}

contract PrintMoney {
    address owner;
    address pancakeRouterAddr = 0x10ED43C718714eb63d5aA57B78B54704E256024E;
    IPancakeswap pancake = IPancakeswap(0x10ED43C718714eb63d5aA57B78B54704E256024E);
    //IERC20 usdt = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    //IERC20 weth = IERC20(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
    //IERC20 dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    
    //IERC20 weth = IERC20(0xc778417E063141139Fce010982780140Aa0cD5Ab); // ropsten weth
    //IERC20 dai = IERC20(0xaD6D458402F60fD3Bd25163575031ACDce07538D); // ropsten dai
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function setOwner(address _newOwner) onlyOwner external {
        owner = _newOwner;
    }
    
    function approveToken(address token) onlyOwner external {
        IBEP20 bep20 = IBEP20(token);
        bep20.approve(pancakeRouterAddr, uint(-1)); // usdt six decimal would fail!
    }
    
    function printMoney(
        address tokenIn,
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        uint256 deadline
    ) onlyOwner external {
        IBEP20 bep20 = IBEP20(tokenIn);
        bep20.transferFrom(msg.sender, address(this), amountIn);
        pancake.swapExactTokensForTokens(amountIn, amountOutMin, path, msg.sender, deadline);
    }
}