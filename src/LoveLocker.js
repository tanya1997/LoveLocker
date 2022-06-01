import './App.css';
import { ReactComponent as lock } from './lock.svg'
import React, { useState, useEffect } from 'react';
import {Input, Button, FlexboxGrid, Content, Form, Panel, ButtonToolbar, Container, DatePicker, toaster, Notification, Modal } from 'rsuite'
import { Icon } from '@rsuite/icons';

import "rsuite-color-picker/lib/styles.css"
import 'rsuite-color-picker/lib/styles.less'
import 'rsuite/dist/rsuite.min.css';
import ColorPicker from 'rsuite-color-picker'
import * as IPFS from 'ipfs-core'
const xrpl = require("xrpl");

function LoveLocker() {

  const defaultValue = 'pink'
  const defaultDate = new Date()
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [name3, setName3] = useState('');
  const [text1, setText1] = useState('');
  const [date1, setDate1] = useState(defaultDate);
  const [color1, setColor1] = useState(defaultValue);

  const [secret1, setSecret1] = useState('');

  const [open, setOpen] = React.useState(false);
  const [backdrop, setBackdrop] = React.useState('static');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [results,setResults] = useState('');

  function handleClick() {
    if (name1 == '' || text1 == '' || secret1 == ''){
      toaster.push(<Notification closable={true} type="error" header="error" >Not all fields are set</Notification>, {
        placement: 'topCenter'

      });
      return;
    }

    let state = {
      'name1' : name1,
      'name2' : name2,
      'name3' : name3,
      'text1' : text1,
      'date1' : date1,
      'color1' : color1,
    }
    var constJSON = JSON.stringify(state);
    console.log(constJSON);

    var client;
    toaster.push(<Notification closable={true} type="info" header="info" duration={40000} >Data processing. Wait, please</Notification>, {
        placement: 'topCenter'

      });
    const fetchData = async () => {

      /*ipfs*/
      const ipfs = await IPFS.create()
      const { cid } = await ipfs.add(constJSON)
      console.info(cid.toString())

      /*xrpl*/
      client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
      await client.connect()
      const test_wallet1 = xrpl.Wallet.fromSeed(secret1) // Test secret; don't use for real
      const transactionBlob = {
        TransactionType: "NFTokenMint",
        Account: test_wallet1.classicAddress,
        URI: xrpl.convertStringToHex(cid.toString()),
        Flags: 8,
        NFTokenTaxon: 0
    }
    console.log(transactionBlob);
    const tx = await client.submitAndWait(transactionBlob, {wallet: test_wallet1, autofill: true})
    
    console.log(tx);
    let nfts = await client.request({
      method: "account_nfts",
      account: test_wallet1.classicAddress
    })
    console.log(nfts)
    const result_nft = nfts.result.account_nfts
    console.log(result_nft[result_nft.length -1].NFTokenID);
    setResults(result_nft[result_nft.length -1].NFTokenID);
    setOpen(true)
    return;
    }
    fetchData();

    //client.disconnect()
  }

  function name1Change(event){
    setName1(event);
  }

  function name2Change(event){
    setName2(event);
  }

  function name3Change(event){
    setName3(event);
  }

  function text1Change(event){
    setText1(event);
  }

  function color1Change(event){
    setColor1(event.hex);
  }

  function date1Change(event){
    //console.log(event)
    setDate1(event);
  }

  function secret1Change(event){
    //console.log(event)
    setSecret1(event);
  }

  return (
    <div className='MainContainer'>
      <Container >
        <Content>
          <FlexboxGrid justify="center">
            <FlexboxGrid.Item colspan={12}>
              <Panel header={<h3>Love ❤ Locker </h3>} bordered>
              <Form layout="horizontal">
                <Form.Group>
                  <Form.ControlLabel>Name</Form.ControlLabel>
                  <Form.Control name="name" onChange={name1Change} value={name1}></Form.Control>
                  <Form.HelpText>Required</Form.HelpText>
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Name</Form.ControlLabel>
                  <Form.Control name="name" onChange={name2Change} value={name2}/>
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Name</Form.ControlLabel>
                  <Form.Control name="name" onChange={name3Change} value={name3} />
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Text</Form.ControlLabel>
                  <Form.Control name="name" onChange={text1Change} value={text1} />
                  <Form.HelpText>Required</Form.HelpText>
                </Form.Group>
                <Form.Group>
                <Form.ControlLabel>Date&Color</Form.ControlLabel>
                  <Form.Control size="md" placeholder="Medium" name="textarea" value={date1} onChange={date1Change} accepter={DatePicker} />
                  <Form.Control value={color1} onChange={color1Change} name="colorpicker" accepter={ColorPicker} />
                  <Form.HelpText>Required</Form.HelpText>
                </Form.Group>
                <Form.Group>
                  <Icon as={lock} style={{ color: color1, height: '100px', width: '100px', display: 'block', margin: 'auto' }} />
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>XRPL Seed</Form.ControlLabel>
                  <Form.Control name="name" onChange={secret1Change} value={secret1}/>
                  <Form.HelpText>Required</Form.HelpText>
                </Form.Group>
                <Form.Group>
                    <Button appearance="primary" block  onClick={handleClick}>Submit</Button>
                </Form.Group>
              </Form>
              </Panel>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Content>
      </Container>

      <Modal backdrop={backdrop} keyboard={false} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>NFTokenID</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <Input readOnly value={results} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LoveLocker;
