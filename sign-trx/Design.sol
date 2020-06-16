// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
contract  Design {       

    uint256 private number;

    constructor() public {
       number =  0;
    }

    function incNumber(uint256 _value) public {
       number = number  + _value;
    }

    function getNumber() public view returns (uint256) {
        return number;
    }
}
