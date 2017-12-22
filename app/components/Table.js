// @flow
import React, { Component } from 'react';

var products2 = [{
  id: 1,
  name: "Product1",
  price: 120
},
{
  id: 2,
  name: "Product2",
  price: 80
}];

class Table extends Component {
  render() {
    return (
      <BootstrapTable data={ products2 }>
        <TableHeaderColumn dataField='id' isKey>Product ID</TableHeaderColumn>
        <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
        <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default Table;
