import './App.css';
import { ReactComponent as lock } from './lock.svg'
import React, { useState, useEffect } from 'react';
import {Input, Button, FlexboxGrid, Content, Form, Panel, ButtonToolbar, Container, DatePicker, toaster, Notification, Modal } from 'rsuite'
import { Icon } from '@rsuite/icons';

import "rsuite-color-picker/lib/styles.css"
import 'rsuite-color-picker/lib/styles.less'
import 'rsuite/dist/rsuite.min.css';
import * as IPFS from 'ipfs-core'
const xrpl = require("xrpl");


function utostr(binArray)
            {
                var str = "";
                for (var i = 0; i < binArray.length; i++) {
                    str += String.fromCharCode(parseInt(binArray[i]));
                    //console.log(str)
                }
                return JSON.parse(str)
            }

function LoveLockerViewer() {

  const defaultValue = 'pink'
  const defaultDate = new Date()
  const [name1, setName1] = useState('');
  const [text1, setText1] = useState('');
  const [date1, setDate1] = useState(defaultDate);
  const [date2, setDate2] = useState('');
  const [color1, setColor1] = useState(defaultValue);

  const [viewVisible, setViewVisible] = useState('hidden');

  const [addressWallet1, setAddressWallet1] = useState('');
  const [NFTokenID1, setNFTokenID1] = useState('');

  function handleClick() {
    if (addressWallet1 == '' || NFTokenID1 == ''){

        toaster.push(<Notification closable={true} type="error" header="error" >Not all fields are set</Notification>, {
            placement: 'topCenter'
    
          });
        return;
    }

    var client;
    toaster.push(<Notification closable={true} type="info" header="info" duration={30000} >Data processing. Wait, please</Notification>, {
        placement: 'topCenter'

      });
    const fetchData = async () => {
      /*xrpl*/
      client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
      await client.connect()
    let nfts = await client.request({
      method: "account_nfts",
      account: addressWallet1
    })
    const result_nft = nfts.result.account_nfts

    var found = '';
    result_nft.forEach(element => {
        console.log(element)
        if (element.NFTokenID == NFTokenID1){
            found = xrpl.convertHexToString(element.URI);
        }
    });

    if (found == ''){
        toaster.push(<Notification closable={true} type="error" header="error" >Not found NFToken</Notification>, {
            placement: 'topCenter'
    
          });
          return

    }else{
        const ipfs = await IPFS.create()
        const chunks = []
        for await (const chunk of ipfs.cat(found)) {
        chunks.push(chunk)
        }

        const jsonValue = utostr(chunks[0])
        var superName = jsonValue['name1']
        if (jsonValue['name2'] != ''){
            superName = superName + '&'+ jsonValue['name2'];
        }
        if (jsonValue['name3'] != ''){
            superName = superName + '&'+ jsonValue['name3'];
        }
        setName1(superName)
        const currentDate = new Date(jsonValue['date1'])


        var year = currentDate.getFullYear();
        var month = currentDate.getMonth();
        var day = currentDate.getDate();

        var interestingDates = '';
        interestingDates += '100 days: ' +  new Date(year, month, day + 100).toISOString().split('T')[0] + '\n'
        interestingDates += '500 days: ' +  new Date(year, month, day + 500).toISOString().split('T')[0] + '\n'
        interestingDates += '1000 days: ' + new Date(year, month, day + 1000).toISOString().split('T')[0] + '\n'
        interestingDates += '2000 days: ' + new Date(year, month, day + 2000).toISOString().split('T')[0] + '\n'
        interestingDates += '5000 days: ' + new Date(year, month, day + 5000).toISOString().split('T')[0] + '\n'

        interestingDates += '1 Month: ' + new Date(year, month+1, day+1).toISOString().split('T')[0] + '\n'
        interestingDates += '2 Month: ' + new Date(year, month+2, day+1).toISOString().split('T')[0] + '\n'
        interestingDates += '6 Month: ' + new Date(year, month+6, day+1).toISOString().split('T')[0] + '\n'

        interestingDates += '1 Year: ' + new Date(year + 1, month, day).toISOString().split('T')[0] + '\n'
        interestingDates += '5 Year: ' + new Date(year + 5, month, day).toISOString().split('T')[0] + '\n'
        interestingDates += '10 Year: ' + new Date(year + 10, month, day).toISOString().split('T')[0] + '\n'
        interestingDates += '15 Year: ' + new Date(year + 15, month, day).toISOString().split('T')[0] + '\n'

        setDate2(interestingDates)
        setDate1(currentDate)
        setText1(jsonValue['text1'])
        setColor1(jsonValue['color1'])
        setViewVisible('visible')
      //console.info(data)
    }
    
    console.log(result_nft[result_nft.length -1].NFTokenID);
    return;
    }
    fetchData();

    client.disconnect()
  }

  function addressWallet1Change(event){
    setAddressWallet1(event);
  }

  function NFTokenID1Change(event){
    setNFTokenID1(event);
  }


  return (
    <div className='MainContainer'>
      <Container>
        <Content>
          <FlexboxGrid justify="center">
            <FlexboxGrid.Item colspan={12}>
              <Panel header={<h3>Love ❤ Locker ❤ Viewer</h3>} bordered>
              <Form layout="horizontal">
                <Form.Group>
                  <Form.ControlLabel>Address Wallet</Form.ControlLabel>
                  <Form.Control name="name" onChange={addressWallet1Change} value={addressWallet1}></Form.Control>
                  <Form.HelpText>Required</Form.HelpText>
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>NFTokenID</Form.ControlLabel>
                  <Form.Control name="name" onChange={NFTokenID1Change} value={NFTokenID1}/>
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
      <Container style={{ visibility: viewVisible}}>
        <label className='LabelContainer'>{name1}</label>
        <label className='LabelContainer'>{text1}</label>
        <DatePicker className='DateContainer' readOnly defaultValue={date1} value={date1} />
        <Icon as={lock} style={{ color: color1, height: '200px', width: '200px', display: 'block', margin: 'auto' }} />
        <Input as="textarea" style={{ textAlign: 'center'}} value={date2} rows={12} placeholder="Textarea" readOnly />
      </Container>
    </div>
  );
}

export default LoveLockerViewer;
