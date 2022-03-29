import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CInput,
  CNav,
  CNavItem,
  CNavLink,
  CTabs,
  CTabPane,
  CTabContent,
  CInputGroup,
  CLabel,
  CTextarea,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CImg,
} from "@coreui/react";
import firebase from "../../config/fbconfig";
// import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { useFormik } from "formik";

const StockReport = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const socData = Date.now() - (24 * 60 * 60 * 1000);
  const curData = Date.now();
  var[order, setOrder] = useState(socData);
//   console.log(order);
//   console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(order));
  var[porder, setPorder] = useState(curData);
  const[weight,setWeight]=useState([]);
  const[sName,setSName]=useState([]);
  const[sQuantity,setSQuantity]=useState([]);
  const[sfinal,setSFinal]=useState([]);
  const[shopWeight,setShopWeight]=useState([]);
  const[shopName,setShopName]=useState([]);
  const[shopQuantity,setShopQuantity]=useState([]);

  const[hotelWeight,setHotelWeight]=useState([]);
  const[hotelName,setHotelName]=useState([]);
  const[hotelQuantity,setHotelQuantity]=useState([]);
  var [counttemp ,setTemp] = useState(0);

  
  const PriceData = {
    name: "",
    quantity: "",
    weight: "",
  };
  var [stock, setStock] = useState({
        name: ([]),
        quantity:([]),
        weight: ([]),
        pid:([]),
        finalWeight :([])
});
var [sstock, setSStock] = useState({
    name: ([]),
    quantity:([]),
    weight: ([]),
    pid:([])
});
var [hstock, setHStock] = useState({
    name: ([]),
    quantity:([]),
    weight: ([]),
    pid:([])
});
  const[dorder, setDorder] = useState("");
  const[cat,setCat]=useState([]);
  const[catData,setCatdata]=useState([]);
  const[shopData,setShopdata]=useState([]);
  const[hotelData,setHoteldata]=useState([]);
  var [state, setState] = useState({
    users: null,
    porder: null,
    lorder: null,
    dorder:null,
  });

  useEffect(() => {
    getUsers();
  }, []);
  useEffect(() => {
    data();
  }, [refresh]);

  const getUsers = async () => {
    setLoading(true);
    const users = await firebase.firestore().collection("orders").where("orderStatus","==","processed").get();
    // filter((x) => x.orderStatus === 'placed')

    const resolvedUsers = users.docs.map((user) => {

      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        productid: id,
        ddate:new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(userData.datePlaced),
        date:userData.datePlaced,
        amount:userData.totalAmount,
        isCancelled:userData.isCancelled,
        userType:userData.userType,
        temp:userData.items,
        oitems:userData.items.map(sub=>{
            return(sub.name)
        }),
        
        // name: userData.name || "Not Defined",
        // whatsAppNumber: userData.whatsAppNumber || "-",
        // referralCode: userData.referralCode
        //   ? userData.referralCode.toString()
        //   : "",
        // primaryAddress:
        //   userData.addresses && userData.addresses.length > 0
        //     ? `${userData.addresses[0].line1}, ${userData.addresses[0].line2}, ${userData.addresses[0].city}, ${userData.addresses[0].state}`
        //     : "Not Defined",
        // id: user.id,
      };
      
    });
    setState({
      ...state,
      users: resolvedUsers,
    });
    setCat(resolvedUsers);
    setLoading(false);
    // console.log(resolvedUsers);
    setRefresh(!refresh);
  };

const data= () =>{
    try{
    var found = false;
        state.users.map((sub) =>{
            // console.log(sub);
            if (sub.userType == 'Society' && sub.isCancelled == false) {
                sub.temp.map(async(sub1,index)=>{
                    // var check = stock.name.indexOf(sub1.name)
                    if (stock.name.indexOf(sub1.name) > -1) {
                                // stock.quantity[index].push(stock.quantity[index]+=sub1.quantity);
                                // console.log("ashjduasjdhkasndasjndkjn"); 
                                let ind1 = 0;
                                ind1 = stock.name.indexOf(sub1.name); 
                                console.log(sub1.name); 
                                console.log(stock.quantity.at(index));
                                console.log(sub1.quantity);
                                // console.log(stock.quantity[index]+=sub1.quantity); 

                                console.log(stock.finalWeight.at(ind1));
                                let fk1=0;
                                let texts12 = sub1.weight;
                            const myArrays12 = texts12.split(" ");
                            let newW = 0;
                            if(myArrays12[1]=="gms"  || myArrays12[1]=="ml")
                            {
                              newW = myArrays12[0]/1000;
                            }
                            else{
                              newW = myArrays12[0]
                            }
                                fk1 = (stock.finalWeight.at(ind1)+(newW*sub1.quantity));
                                stock.finalWeight[ind1] = fk1
                                // stock.quantity.splice(index, 0, counttemp);
                                console.log(stock.finalWeight[ind1]);
                                // stock.quantity.join();
                                setStock({finalWeight:stock.finalWeight})
                                setSFinal(stock.finalWeight)


                                let counttemp1 = 0; 
                                counttemp1 = stock.quantity.at(index) + sub1.quantity
                                // console.log(counttemp);
                                // stock.quantity[index] = {...stock.quantity[index], [index]: temp};
                                // var back = temp;
                                // temp = 0; 
                                // const updateddata = stock.quantity.map((temp,i) => i== index?
                                // Object.assign(temp,{[temp]: counttemp}) : temp);
                                // console.log(updateddata);
                              
                                // setTemp(back+temp)          {...markers[index], key: value};
                                    // Object.assign(stock.quantity[index] +=sub1.quantity)
                                    // stock.quantity.at(index) = temp;
                                    stock.quantity[index] = counttemp1
                                    // stock.quantity.splice(index, 0, counttemp);
                                    console.log(stock.quantity[index]);
                                    // stock.quantity.join();
                                    setStock({quantity:stock.quantity})
                                    setSQuantity(stock.quantity)

                                    // Object.assign(stock.weight[index]=sub1.weight)
                                    // setStock({weight:stock.weight});
                                    // setWeight(stock.weight);

                            let text = sub1.weight;
                            const myArray = text.split(" ");
                            // var temp=sub1.quantity*myArray[0]

                            let temptxt = stock.weight[index];
                            const mySArray = temptxt.split(" ");
                            // var temp2 = 1*mySArray[0];

                            if(mySArray[1] === "gms" &&  myArray[1] == "kg"){
                                Object.assign(stock.weight[index]=sub1.weight)
                                setStock({weight:stock.weight});
                                setWeight(stock.weight);
                            }else if(mySArray[1] === "ml" &&  myArray[1] == "Litre"){
                                Object.assign(stock.weight[index]=sub1.weight)
                                setStock({weight:stock.weight});
                                setWeight(stock.weight);
                            }
                            // if(mySArray[1] === "gms" || mySArray[1] === "ml"){
                            //     if(myArray[1] === "gms" || myArray[1] === "ml"){
                            //         // var converted = temp/1000;
                            //         var addn = temp2+=temp
                            //         // console.log(addn);
                            //         // console.log("nnvnvvnvnvnvvnvnvnvnvvnvnvnvnvnv");
                            //         Object.assign(stock.quantity[index]=myArray[1] == "gms"? addn>=1000?(addn/1000)+" "+"Kg" :addn+" "+"gms" :myArray[1] == "ml"?addn>=1000?(addn/1000)+" "+"Liters":addn+" "+"ml":addn+" "+myArray[1]);
                            //         setSQuantity(stock.quantity)
                            //     }else{
                            //         var converted = temp2/1000;
                            //         var add = converted+=temp
                            //         Object.assign(stock.quantity[index]=add+" "+ myArray[1]);
                            //         setSQuantity(stock.quantity)
                            //     }
                            // }else{
                            //     if(myArray[1] === "gms" || myArray[1] === "ml"){
                            //         var converted = temp/1000;
                            //         var addn = temp2+=converted
                            //         // console.log(addn);
                            //         // console.log("nnvnvvnvnvnvvnvnvnvnvvnvnvnvnvnv");
                            //         Object.assign(stock.quantity[index]=addn+" "+ mySArray[1]);
                            //         setSQuantity(stock.quantity)
                            //     }else{
                            //         var add = temp2+=temp
                            //         Object.assign(stock.quantity[index]=add+" "+ mySArray[1]);
                            //         setSQuantity(stock.quantity)
                            //     }
                            // }
                        found = true;
                        // break;
                    }else if (stock.name.indexOf(sub1.name) == -1) {
                        
                        console.log(sub1.quantity)
                        stock.quantity.push(sub1.quantity);
                        setStock({quantity:[...stock.quantity, stock.quantity]});
                        console.log(stock.quantity)
                        // Object.assign(stock.quantity[index]=sub1.quantity)
                        // setStock({quantity:stock.quantity})
                        setSQuantity(stock.quantity)
    
                        // Object.assign(stock.weight[index]=sub1.weight)
                        // setStock({weight:stock.weight})
                        stock.weight.push(sub1.weight);
                        setStock({weight:[...stock.weight, stock.weight]});
                        setWeight(stock.weight);
    

                        let texts = sub1.weight;
                            const myArrays = texts.split(" ");
                            let newW = 0;
                            if(myArrays[1]=="gms"  || myArrays[1]=="ml")
                            {
                              newW = myArrays[0]/1000;
                            }
                            else{
                              newW = myArrays[0]
                            }
                            stock.finalWeight && stock.finalWeight.push(newW * sub1.quantity);
                        setStock({finalWeight:[...stock.finalWeight, stock.finalWeight]});
                        setSFinal(stock.finalWeight);
                        console.log(stock.finalWeight)
                        // Object.assign(stock.name[index]=sub1.name)
                        // setStock({name:stock.name})
                        stock.name.push(sub1.name);
                        setStock({name:[...stock.name, stock.name]});
                        setSName(stock.name)

                        stock.pid.push(getCategory(sub1.name));
                        setStock({id:[...stock.pid, stock.pid]});
                        
                        console.log(stock);
                    }
                    else{
                       console.log("Clicked");
                    //    temp = stock.quantity[index]  + sub1.quantity 
                    //    console.log(temp);
                                // stock.quantity[index] = {...stock.quantity[index], [index]: temp};
                                // var back = temp;
                                // temp = 0; 
                              
                                // setTemp(back+temp)          {...markers[index], key: value};
                                    // Object.assign(stock.quantity[index] = temp)
                                    // setStock({quantity:stock.quantity})
                                    // setSQuantity(stock.quantity)
                    }
                })
            }else if (sub.userType == 'Shop' && sub.isCancelled == false) {
                    sub.temp.map((sub1,index)=>{
                        if (sstock.name.indexOf(sub1.name) == 0) {
                                        Object.assign(sstock.quantity[index]+=sub.quantity)
                                        setSStock({quantity:sstock.quantity})
                                        setShopQuantity(sstock.quantity)
                            found = true;
                            // break;
                        }else if(sstock.name.indexOf(sub1.name) == -1){
                            sstock.quantity.push(sub1.quantity);
                            setSStock({quantity:[...sstock.quantity, sstock.quantity]});
                            // Object.assign(sstock.quantity[index]=sub.quantity)
                            // setSStock({quantity:sstock.quantity})
                            setShopQuantity(sstock.quantity)
        
                            // Object.assign(sstock.weight[index]=sub.weight)
                            // setSStock({weight:sstock.weight})
                            sstock.weight.push(sub1.weight);
                            setSStock({weight:[...sstock.weight, sstock.weight]});
                            setShopWeight(sstock.weight);
        
                            // Object.assign(sstock.name[index]=sub.name)
                            // setSStock({name:sstock.name})
                            sstock.name.push(sub1.name);
                            setSStock({name:[...sstock.name, sstock.name]});
                            setShopName(sstock.name)

                            sstock.pid.push(getShopCategory(sub1.name));
                            setSStock({id:[...sstock.pid, sstock.pid]});
                            // console.log(sstock);
                        }
                        else{
                            //    console.log("Clicked");
                            }
                    })
            }else if (sub.userType == 'Hotel' && sub.isCancelled == false) {
                sub.temp.map((sub1,index)=>{
                    if (hstock.name.indexOf(sub1.name) == 0) {
                                    Object.assign(hstock.quantity[index]+=sub.quantity)
                                    setHStock({quantity:hstock.quantity})
                                    setHotelQuantity(hstock.quantity)
                        found = true;
                        // break;
                    }else if(hstock.name.indexOf(sub1.name) == -1){
                        // Object.assign(hstock.quantity[index]=sub.quantity)
                        // setHStock({quantity:hstock.quantity})
                        hstock.quantity.push(sub1.quantity);
                        setHStock({quantity:[...hstock.quantity, hstock.quantity]});
                        setHotelQuantity(hstock.quantity)
    
                        // Object.assign(hstock.weight[index]=sub.weight)
                        // setHStock({weight:hstock.weight})
                        hstock.weight.push(sub1.weight);
                        setHStock({weight:[...hstock.weight, hstock.weight]});
                        setHotelWeight(hstock.weight);
    
                        // Object.assign(hstock.name[index]=sub.name)
                        // setHStock({name:hstock.name})
                        hstock.name.push(sub1.name);
                        setHStock({name:[...hstock.name, stock.hname]});
                        setHotelName(hstock.name)

                        hstock.pid.push(getHotelCategory(sub1.name));
                        setHStock({id:[...hstock.pid, hstock.pid]});
                        // console.log(hstock);
                    }
                    else{
                        //    console.log("Clicked");
                        }
                })
            }
        })
    }catch (error) {
            }
    
};

 const getCategory = async (name) => {
    // setLoading(true);
    const response=await firebase.firestore().collection("products").where("name","==",name);
    const data=await response.get();
    data.docs.forEach(item=>{
        catData.push({id:item.id,...item.data()});
    })
    setCatdata([...catData,catData])
    // console.log(catData);
    // setLoading(false);
    // return catData;
    // console.log(users.date);
  };
  const getShopCategory = async (name) => {
    const response=await firebase.firestore().collection("products").where("name","==",name);
    const data=await response.get();
    data.docs.forEach(item=>{
        shopData.push({id:item.id,...item.data()});
    })
    setShopdata([...shopData,shopData])
  };
  const getHotelCategory = async (name) => {
    const response=await firebase.firestore().collection("products").where("name","==",name);
    const data=await response.get();
    data.docs.forEach(item=>{
        hotelData.push({id:item.id,...item.data()});
    })
    setHoteldata([...hotelData,hotelData])
  };
  // console.log(cat);
//   const prev = async (rowId) => {
//     try {
//       await firebase.firestore().collection("handyOrders").doc(rowId).update({
//         orderStatus : "placed"
//       });
//       history.push('/');
//       history.replace("/users/handy-order");
//       // getUsers();
//       // setRefresh(!refresh);
//       // getPostorder();
//       // alert("Unit Updated");
//     }catch (error) {
//     }
//   };
//   const edit = async (rowId) => {
//     try {
//       await firebase.firestore().collection("handyOrders").doc(rowId).update({
//         orderStatus : "processed"
//       });
//       history.push('/');
//       history.replace("/users/handy-order");
//       // getPostorder();
//       // setRefresh(!refresh);
//       // getUsers();
//       // getLorder();
//       // alert("Unit Updated");
//     }catch (error) {
//     }
//   };
//   const del = async (rowId) => {
//     try {
//       await firebase.firestore().collection("handyOrders").doc(rowId).update({
//         orderStatus : "picked",
//         datePicked : Date.now(),
//         isCompleted:false
//       });
//       history.push('/');
//       history.replace("/users/handy-order");
//     }catch (error) {
//     }
//   };
//   const comp = async (rowId) => {
//     try {
//       await firebase.firestore().collection("handyOrders").doc(rowId).update({
//         orderStatus : "delivered",
//         dateDelivered:Date.now(),
//         isCompleted:true
//       });
//       history.push('/');
//       history.replace("/users/handy-order");
//     }catch (error) {
//     }
//   };
// console.log(state.users);
const onChangeDate =  (e) => {
    porder=new Date(document.getElementById("date-input").value).getTime();
    order=new Date(document.getElementById("date-input").value).getTime()- (24 * 60 * 60 * 1000);
    getUsers();
    setStock({
        name: ([]),
        quantity:([]),
        weight: ([]),
    })
    setSName([])
    setSQuantity([])
  };
    const onExportData = async (e) => {
      let qtemp = 0;
      let qtemp1= 0;
      
    // state.users = cat;
    const filteredData = catData
      .filter((user) => {
        for (const filterKey in tableFilters) {
          console.log(
            String(user[filterKey]).search(
              new RegExp("tableFilters[filterKey]", "i")
            )
          );
          if (
            String(user[filterKey]).search(
              new RegExp(tableFilters[filterKey], "i")
            ) >= 0
          ) {
            continue;
          } else {
            return false;
          }
        }
        return true;
      })
      .map((item,index) => ({
        // let text = weight[index],
        
        name: item.name,
        category:item.categoryName,
        subCategory:item.subCategory,
        // quantity: qtemp = sQuantity[index],
        // weight: counttemp = weight[index],
        finalWeight : sfinal[index]+((weight[index].split(" ")[1] =="gms") ? "kg" : weight[index].split(" ")[1]) || ((weight[index].split(" ")[1] =="ml") ? "Litre" : weight[index].split(" ")[1])
      }));

      console.log(filteredData);
      exportPDF(filteredData);
    exportDataToXLSX(filteredData, "Stockreport");
  };
 const exportDataToXLSX = (dataJSON, filename) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  
    const ws = XLSX.utils.json_to_sheet(dataJSON);
    const wb = { Sheets: { Orders: ws }, SheetNames: ['Orders'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, filename + '.xlsx');
  
  }
  const exportPDF = (e) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Stock Report";
    const headers = [["Category Name","Sub Category Name","Product Name", "finalWeight"]];

    const data = e.map((sub,index) =>{
        if (index+1 != catData.length) {
            if (sName.indexOf(sub.name) == 0) {
                let text = weight[index]
                const myArray = text.split(" ");
                var temp=sQuantity[index]*myArray[0]
                return([sub.category,sub.subCategory,sName[index],(sfinal[index]+" "+((weight[index].split(" ")[1] =="gms") ? "kg" : weight[index].split(" ")[1]) || ((weight[index].split(" ")[1] =="ml") ? "Litre" : weight[index].split(" ")[1]))])
            }else{
                let text = weight[index]
                const myArray = text.split(" ");
                var temp=sQuantity[index]*myArray[0]
                return([sub.category,sub.subCategory,sName[index],(sfinal[index]+" "+((weight[index].split(" ")[1] =="gms") ? "kg" : weight[index].split(" ")[1]) || ((weight[index].split(" ")[1] =="ml") ? "Litre" : weight[index].split(" ")[1]))])
            
            }
        }else{
            return([])
        }
    });
    // props.location.state.items.map(elt=>
    // const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
    // const footer = [["Total Amount: Rs."+props.location.state.amount]]
    // let text = weight[index]
    //     const myArray = text.split(" ");
    //     var temp=sQuantity[index]*myArray[0]


    let content = {
      startY: 50,
      head: headers,
      body: data,
      // content:charge,
      // foot:footer
    };

    console.log(content);
    console.log(data);
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("stockreport.pdf")
  }
  const onShopExportData = async (e) => {
    // state.users = cat;
    const filteredData = shopData
      .filter((user) => {
        for (const filterKey in tableFilters) {
          console.log(
            String(user[filterKey]).search(
              new RegExp("tableFilters[filterKey]", "i")
            )
          );
          if (
            String(user[filterKey]).search(
              new RegExp(tableFilters[filterKey], "i")
            ) >= 0
          ) {
            continue;
          } else {
            return false;
          }
        }
        return true;
      })
      .map((item) => ({
        name: item.name,
        category:item.categoryName,
        subCategory:item.subCategory
      }));

    //   console.log(filteredData);
      exportshopPDF(filteredData);
    // exportDataToXLSX(filteredData, "usersList");
  };
  const exportshopPDF = (e) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Stock Report";
    const headers = [["Category Name","Sub Category Name","Product Name","Quantity"]];

    const data = e.map((sub,index) =>{
        if (index+1 != catData.length) {
            if (sName.indexOf(sub.name) == 0) {
                let text = weight[index]
                const myArray = text.split(" ");
                var temp=sQuantity[index]*myArray[0]
                return([sub.category,sub.subCategory,sName[index],myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]])
            }else{
                let text = weight[index]
                const myArray = text.split(" ");
                var temp=sQuantity[index]*myArray[0]
                return([sub.category,sub.subCategory,sName[index],myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]])
            
            }
        }else{
            return([])
        }
    });
    // props.location.state.items.map(elt=>
    // const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
    // const footer = [["Total Amount: Rs."+props.location.state.amount]]
    // let text = weight[index]
    //     const myArray = text.split(" ");
    //     var temp=sQuantity[index]*myArray[0]


    let content = {
      startY: 50,
      head: headers,
      body: data,
      // content:charge,
      // foot:footer
    };

    console.log(content);
    console.log(data);
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("stockreport.pdf")
  }
  const onHotelExportData = async (e) => {
    // state.users = cat;
    const filteredData = hotelData
      .filter((user) => {
        for (const filterKey in tableFilters) {
          console.log(
            String(user[filterKey]).search(
              new RegExp("tableFilters[filterKey]", "i")
            )
          );
          if (
            String(user[filterKey]).search(
              new RegExp(tableFilters[filterKey], "i")
            ) >= 0
          ) {
            continue;
          } else {
            return false;
          }
        }
        return true;
      })
      .map((item) => ({
        name: item.name,
        category:item.categoryName,
        subCategory:item.subCategory
      }));

    //   console.log(filteredData);
        exporthotelPDF(filteredData);
    // exportDataToXLSX(filteredData, "usersList");
  };
  const exporthotelPDF = (e) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Stock Report";
    const headers = [["Category Name","Sub Category Name","Product Name","Quantity"]];

    const data = e.map((sub,index) =>{
        if (index+1 != catData.length) {
            if (sName.indexOf(sub.name) == 0) {
                let text = weight[index]
                const myArray = text.split(" ");
                var temp=sQuantity[index]*myArray[0]
                return([sub.category,sub.subCategory,sName[index],myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]])
            }else{
                let text = weight[index]
                const myArray = text.split(" ");
                var temp=sQuantity[index]*myArray[0]
                return([sub.category,sub.subCategory,sName[index],myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]])
            
            }
        }else{
            return([])
        }
    });
    // props.location.state.items.map(elt=>
    // const charge = [["Service Charge: Rs."+props.location.state.serviceCharges]]
    // const footer = [["Total Amount: Rs."+props.location.state.amount]]
    // let text = weight[index]
    //     const myArray = text.split(" ");
    //     var temp=sQuantity[index]*myArray[0]


    let content = {
      startY: 50,
      head: headers,
      body: data,
      // content:charge,
      // foot:footer
    };

    console.log(content);
    console.log(data);
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("stockreport.pdf")
  }
  const deleteVideo = (item,rowId) => {
    confirmAlert({
      title: "Cancel Order",
      message: <CRow>
      <CCol sm={12}>
      <CLabel style={{ marginLeft: "15px"}} rows="3">Status :</CLabel>
      <select
       style={{ marginLeft: "21px",border: "1px solid #d8dbe0",borderRadius: "0.25rem",textAlign: "left"}}
       id="dropdown"
       >
        <option value="Out Of Stock">Out Of Stock</option>
        <option value="Wrong Item">Wrong Item</option>
        <option value="Quality Issue">Quality Issue</option>
        <option value="Other">Other</option>
      </select>
      </CCol>
        <CLabel style={{ marginLeft: "15px"}}>Comment :</CLabel>
        <br></br>
        <div class="form-floating"style={{ marginLeft: "15px",color:"#333"}} rows="3">
        <textarea placeholder="Leave a comment here" name="textarea" id="floatingTextarea" />
      </div>
      </CRow>,
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("handyOrders").doc(rowId).update({
              orderStatus : "cancelled",
              isCancelled:true,
              comment:document.getElementById("floatingTextarea").value,
              message:document.getElementById("dropdown").value
            });
            item.payment.map(async(sub)=>{
              if(sub.method != "COD"){
                await firebase.firestore().collection("users").doc(item.customerId).collection("wallet").add({
                  amount:sub.amount,
                  date:Date.now(),
                  message:"Order Cancelled and Amount Added to Wallet",
                  type:"credit" 
                });
                
                await firebase.firestore().collection("users").doc(item.customerId).update({
                  walletAmount:firebase.firestore.FieldValue.increment(sub.amount.valueOf())
                });
                alert("Amount Added to Wallet");
              }
            })
            alert("Order Cancelled!");
            getUsers();
            setRefresh(!refresh);

          },
        },
        {
          label: "No",
          // onClick: () => alert("Close"),
        },
      ],
      // childrenElement: () => 
      // customUI: ({ onClose }) => <div>Custom UI</div>,
      closeOnEscape: true,
      closeOnClickOutside: true,
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypressEscape: () => {},
      // overlayClassName: "overlay-custom-class-name"
    });

  };
  const view = async(data,rowId) => {
    history.push(
      {
      pathname: '/users/user',
      state: data,
      id: rowId
      }
    )
  };

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center" style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}}>
            <span className="font-xl">Tomorrow Stock Report</span>
            <span>
                <CInput type="date" id="date-input" name="date-input" placeholder="date" onChange={() => onChangeDate()}/>
            </span>
            {/* <span>
              <CButton color="info" className="mr-3"
              onClick={() => onExportData()}
               >
                Export Data
              </CButton>
            </span> */}
          </CCardHeader>
          <CCardBody>
            <CTabs activeTab="home">
                <CNav variant="tabs">
                <CNavItem>
                    <CNavLink data-tab="home">
                    Society Order Report
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink data-tab="profile">
                        Shop Order Report
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink data-tab="messages">
                        Hotel Order Report
                    </CNavLink>
                </CNavItem>
                </CNav>
                <CTabContent>
                <CTabPane data-tab="home">
                <CCardHeader className="d-flex justify-content-between align-items-center" style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}}>
                    <span className="font-xl">Society Stock Report</span>
                    <span>
                    <CButton color="info" className="mr-3"
                    onClick={() => onExportData()}
                    >
                        Export Data
                    </CButton>
                    </span>
                </CCardHeader>
                        <CDataTable
                            loading={loading}
                            onColumnFilterChange={(e) => {
                                setTableFilters(e);
                            }}
                            onSorterValueChange={(e) => {
                                console.log(e);
                            }}
                            onTableFilterChange={(filter) => setTableFilters(filter)}
                            items={catData}
                            fields={[
                                { key: "index", label:"Sr No", filter: false},
                                { key: "categoryName", label: "Category Name", filter:true},
                                { key: "subCategory", label: "SubCategory Name", filter:true},
                                { key: "name", label: "Society Order List", filter: true},
                            ]}
                            scopedSlots={{
                                index: (item,index) => {
                                    return (
                                        <td>{index+1}
                                        </td>
                                    );
                                },
                                categoryName:(item)=>{
                                    return(
                                        <td>
                                            {
                                            item.categoryName
                                            }
                                        </td>
                                    );
                                },
                                subCategory:(item)=>{
                                    return(
                                        <td>
                                            {
                                                item.subCategory
                                            }
                                        </td>
                                    );
                                },
                                name:(item,index)=>{
                                    if (index+1 != catData.length) {
                                    let text = weight[index];
                                    const myArray = text.split(" ");
                                    var temp=sQuantity[index]*myArray[0]
                                    return(
                                        <td>
                                            {
                                            <div>{item.name} : {myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</div>
                                            }
                                        </td>
                                    );
                                    }else 
                                    return(
                                        <td>
                                        </td>
                                    )
                                },
                            }}
                            hover
                            striped
                            columnFilter
                            sorter
                            pagination
                            itemsPerPage={30}
                            clickableRows
                            />
                </CTabPane>
                <CTabPane data-tab="profile">
                    <CCardHeader className="d-flex justify-content-between align-items-center" style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}}>
                        <span className="font-xl">Shop Stock Report</span>
                        <span>
                        <CButton color="info" className="mr-3"
                        onClick={() => onShopExportData()}
                        >
                            Export Data
                        </CButton>
                        </span>
                    </CCardHeader>
                        <CDataTable
                            loading={loading}
                            onColumnFilterChange={(e) => {
                                setTableFilters(e);
                            }}
                            onSorterValueChange={(e) => {
                                console.log(e);
                            }}
                            onTableFilterChange={(filter) => setTableFilters(filter)}
                            items={shopData}
                            fields={[
                                { key: "index", label:"Sr No", filter: false},
                                { key: "categoryName", label: "Category Name", filter:true},
                                { key: "subCategory", label: "SubCategory Name", filter:true},
                                { key: "name", label: "Society Order List", filter: true},
                            ]}
                            scopedSlots={{
                                index: (item,index) => {
                                    return (
                                        <td>{index+1}
                                        </td>
                                    );
                                },
                                categoryName:(item)=>{
                                    return(
                                        <td>
                                            {
                                            item.categoryName
                                            }
                                        </td>
                                    );
                                },
                                subCategory:(item)=>{
                                    return(
                                        <td>
                                            {
                                                item.subCategory
                                            }
                                        </td>
                                    );
                                },
                                name:(item,index)=>{
                                    if (index+1 != shopData.length) {
                                        let text = shopWeight[index];
                                        const myArray = text.split(" ");
                                        var temp=shopQuantity[index]*myArray[0]
                                    return(
                                        <td>
                                            {
                                            <div>{item.name} : {myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</div>
                                            }
                                        </td>
                                    );
                                    }else 
                                    return(
                                        <td>
                                        </td>
                                    )
                                },
                            }}
                            hover
                            striped
                            columnFilter
                            sorter
                            pagination
                            itemsPerPage={30}
                            clickableRows
                            />

                        {/* <CDataTable
                            loading={loading}
                            onColumnFilterChange={(e) => {
                                setTableFilters(e);
                            }}
                            onSorterValueChange={(e) => {
                                console.log(e);
                            }}
                            onTableFilterChange={(filter) => setTableFilters(filter)}
                            items={shopName}
                            fields={[
                                // { key: "index", label:"Sr No", filter: false},
                                // { key: "ddate", label:"Order Date", filter: true},
                            //   { key: "id", label: "Order Id", filter: true},
                            //   { key: "type", label: "User Type", filter: true},
                            //   { key: "cname", label: "User Details", filter: true},
                                // { key: "details", label: "User Details", filter: true},
                            //   { key: "wing", label: "Wing", filter: true},
                            //   { key: "fno", label: "Flat No", filter: true},
                            //   { key: "socName",label:"Society Name", filter: true},
                                // { key: "sName", label: "Society Order List", filter: false},
                                { key: "quantity", label: "Shop Order List", filter: false },
                                // { key: "comment", label: "Hotel Order List", filter: true },
                            //   { key: "message", label: "Message", filter: true },
                                //  // { key: "mode", label: "Payment" , filter: true},
                            //   { key: "action", label: "Action" , filter: false},
                            ]}
                            scopedSlots={{                
                                quantity:(item,index)=>{
                                let text = shopWeight[index];
                                const myArray = text.split(" ");
                                var temp=shopQuantity[index]*myArray[0]
                                    return(
                                        <td>
                                            {
                                                <div>{item} : {myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</div>

                                            }
                                        </td>
                                    );
                                }
                            }}
                            hover
                            striped
                            columnFilter
                            // tableFilter
                            sorter
                            pagination
                            // itemsPerPageSelect
                            itemsPerPage={30}
                            clickableRows
                            // onRowClick={(item) =>view(item.id)}
                            
                            /> */}
                    
                </CTabPane>
                <CTabPane data-tab="messages">
                    <CCardHeader className="d-flex justify-content-between align-items-center" style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}}>
                        <span className="font-xl">Hotel Stock Report</span>
                        <span>
                        <CButton color="info" className="mr-3"
                        onClick={() => onHotelExportData()}
                        >
                            Export Data
                        </CButton>
                        </span>
                    </CCardHeader>
                        <CDataTable
                            loading={loading}
                            onColumnFilterChange={(e) => {
                                setTableFilters(e);
                            }}
                            onSorterValueChange={(e) => {
                                console.log(e);
                            }}
                            onTableFilterChange={(filter) => setTableFilters(filter)}
                            items={hotelData}
                            fields={[
                                { key: "index", label:"Sr No", filter: false},
                                { key: "categoryName", label: "Category Name", filter:true},
                                { key: "subCategory", label: "SubCategory Name", filter:true},
                                { key: "name", label: "Society Order List", filter: true},
                            ]}
                            scopedSlots={{
                                index: (item,index) => {
                                    return (
                                        <td>{index+1}
                                        </td>
                                    );
                                },
                                categoryName:(item)=>{
                                    return(
                                        <td>
                                            {
                                            item.categoryName
                                            }
                                        </td>
                                    );
                                },
                                subCategory:(item)=>{
                                    return(
                                        <td>
                                            {
                                                item.subCategory
                                            }
                                        </td>
                                    );
                                },
                                name:(item,index)=>{
                                    if (index+1 != hotelData.length) {
                                        let text = hotelWeight[index];
                                        const myArray = text.split(" ");
                                        var temp=hotelQuantity[index]*myArray[0]
                                    return(
                                        <td>
                                            {
                                            <div>{item.name} : {myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</div>
                                            }
                                        </td>
                                    );
                                    }else 
                                    return(
                                        <td>
                                        </td>
                                    )
                                },
                            }}
                            hover
                            striped
                            columnFilter
                            sorter
                            pagination
                            itemsPerPage={30}
                            clickableRows
                            />
                    
                {/* <CDataTable
                            loading={loading}
                            onColumnFilterChange={(e) => {
                                setTableFilters(e);
                            }}
                            onSorterValueChange={(e) => {
                                console.log(e);
                            }}
                            onTableFilterChange={(filter) => setTableFilters(filter)}
                            items={hotelName}
                            fields={[
                                { key: "index", label:"Sr No", filter: false},
                                // { key: "ddate", label:"Order Date", filter: true},
                            //   { key: "id", label: "Order Id", filter: true},
                            //   { key: "type", label: "User Type", filter: true},
                            //   { key: "cname", label: "User Details", filter: true},
                                // { key: "details", label: "User Details", filter: true},
                            //   { key: "wing", label: "Wing", filter: true},
                            //   { key: "fno", label: "Flat No", filter: true},
                            //   { key: "socName",label:"Society Name", filter: true},
                                { key: "hotelName", label: "Product Name", filter: false},
                                { key: "quantity", label: "Total Quantity", filter: false },
                            //   { key: "comment", label: "Comment", filter: true },
                            //   { key: "message", label: "Message", filter: true },
                                //  // { key: "mode", label: "Payment" , filter: true},
                            //   { key: "action", label: "Action" , filter: false},
                            ]}
                            scopedSlots={{
                                index: (item,index) => {
                                    return (
                                        <td>{index+1}
                                        </td>
                                    );
                                },
                                hotelName:(item)=>{
                                    return(
                                        <td>
                                            {
                                            item
                                            }
                                        </td>
                                    );
                                },
                                quantity:(item,index)=>{
                                    let text = hotelWeight[index];
                                    const myArray = text.split(" ");
                                    var temp=hotelQuantity[index]*myArray[0]
                                    return(
                                        <td>{
                                                <div>{myArray[1] == "gms"? temp>=1000?(temp/1000)+"Kg" :temp+"gms" :myArray[1] == "ml"?temp>=1000?(temp/1000)+"Liters":temp+"ml":temp+myArray[1]}</div>
                                            
                                            }
                                        </td>
                                    );
                                },
                            }}
                            hover
                            striped
                            columnFilter
                            // tableFilter
                            sorter
                            pagination
                            // itemsPerPageSelect
                            itemsPerPage={30}
                            clickableRows
                            // onRowClick={(item) =>view(item.id)}
                            
                            /> */}
                </CTabPane>
                </CTabContent>
            </CTabs>
          
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default StockReport;