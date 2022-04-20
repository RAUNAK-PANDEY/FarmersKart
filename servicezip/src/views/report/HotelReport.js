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
} from "@coreui/react";
import firebase from "../../config/fbconfig";
import { exportDataToXLSX } from "../../utils/exportData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { useFormik } from "formik";

window.def = 1;
// // window.cdef = 0;
window.pro = 0;
// // window.cmsg = 0;
window.lef = 0;
window.del = 0;
// // window.name = 0;
const HotelReport = () => {
  const history = useHistory();

  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [lorder, setLorder] = useState("");
  const [dorder, setDorder] = useState("");
  const [cat, setCat] = useState([]);
  const [data, setData] = useState([]);

  // const socData = Date.now() - (30*(24 * 60 * 60 * 1000));
  // const curData = Date.now();
  const socData = new Date().setHours(0,0,0,0) - (30*(24 * 60 * 60 * 1000));
  const curData = new Date().setHours(23,59,59,999);
  var[order, setOrder] = useState(socData);
  var[porder, setPorder] = useState(curData);

  var [state, setState] = useState({
    users: null,
    porder: null,
    lorder: null,
    dorder: null,
  });
  var [stock, setStock] = useState({
    name: ([]),
    quantity:([]),
    weight: ([]),
    pid:([]),
    finalWeight :([]),
    finalPrice:([])
});
const[weight,setWeight]=useState([]);
  const[sName,setSName]=useState([]);
  const[sQuantity,setSQuantity]=useState([]);
  const[sfinal,setSFinal]=useState([]);
  const[sprice,setSPrice]=useState([]);
  const[catData,setCatdata]=useState([]);
  const[category,setCategory]=useState([]);

  useEffect(() => {
    getUsers();
    getOrders();
    // getPackage();
  }, []);
  useEffect(() => {
    getdata();
  }, [refresh]);

  const getPackage = async () => {
    const response = await firebase
      .firestore()
      .collection("generalData")
      .doc("data")
      .get();
    response.data().packersName.map((sub1) => {
      return data.push(sub1);
    });
    setData([...data, data]);
  };
  const getUsers = async () => {
    setLoading(true);
    const users = await firebase
      .firestore()
      .collection("orders")
      .where("datePlaced", ">=", order)
      .where("datePlaced", "<=", porder)
      .get();
    setOrder(users.docs.length);
    // filter((x) => x.orderStatus === 'placed')

    const resolvedUsers = users.docs.map((user) => {
      const id = user.id;
      const userData = user.data();

      return {
        ...userData,
        id: id,
        cid: userData.customerId,
        ddate: new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(userData.datePlaced),
        date: userData.datePlaced,
        ddateDelivered: new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(userData.dateDelivered),
        dateDelivered: userData.dateDelivered,
        amount: userData.totalAmount,
        cname: userData.customerName,
        cemail: userData.customerEmail,
        cphno: userData.customerNumber,
        fno: userData.flatNo,
        wing: userData.wing,
        socName: userData.societyName,
        status: userData.orderStatus,
        payment: userData.payment,
        packedBy: userData.packedBy,
        oitems: userData.items.map((sub) => {
          return sub.name;
        }),
        userType:userData.userType,
        isCancelled:userData.isCancelled,
        orderStatus:userData.orderStatus,
        temp:userData.items,

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
    setCat(resolvedUsers)
    setLoading(false);
    setRefresh(!refresh);
    // console.log(users.date);
  };
  const getdata = () =>{
    try{
    var found = false;
        state.users.map((sub) =>{
            // console.log(sub);
            if (sub.userType == 'Society' && sub.isCancelled == false) {
                sub.temp.map(async(sub1,index)=>{
                    // console.log(stock.name.indexOf(sub1.name))
                    if (stock.name.indexOf(sub1.name) > -1) {; 
                      let ind1 = 0;
                      ind1 = stock.name.indexOf(sub1.name); 
                      // console.log(sub1.name); 
                      // console.log(stock.quantity.at(index));
                      // console.log(sub1.quantity);
                      // console.log(stock.quantity[index]+=sub1.quantity); 

                      let fk2=0;
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
                                fk2 = (stock.finalPrice.at(ind1)+(newW*sub1.quantity));
                                stock.finalPrice[ind1] = fk2
                                // stock.quantity.splice(index, 0, counttemp);
                                console.log(stock.finalWeight[ind1]);
                                // stock.quantity.join();
                                setStock({finalPrice:stock.finalPrice})
                                setSPrice(stock.finalPrice)

                      // console.log(stock.finalWeight.at(ind1));
                      let fk1=0;
                  //     let texts12 = sub1.weight;
                  // const myArrays12 = texts12.split(" ");
                  // let newW = 0;
                  // if(myArrays12[1]=="gms"  || myArrays12[1]=="ml")
                  // {
                  //   newW = myArrays12[0]/1000;
                  // }
                  // else{
                  //   newW = myArrays12[0]
                  // }
                      fk1 = (stock.finalWeight.at(ind1)+(sub1.discountedPrice*sub1.quantity));
                      stock.finalWeight[ind1] = fk1
                      // stock.quantity.splice(index, 0, counttemp);
                      // console.log(stock.finalWeight[ind1]);
                      // stock.quantity.join();
                      setStock({finalWeight:stock.finalWeight})
                      setSFinal(stock.finalWeight)


                      let counttemp1 = 0; 
                      counttemp1 = (stock.quantity.at(index) + sub1.quantity)
                      stock.quantity[index] = counttemp1
                          // stock.quantity.splice(index, 0, counttemp);
                          // console.log(stock.quantity[index]);
                          // stock.quantity.join();
                          setStock({quantity:stock.quantity})
                          setSQuantity(stock.quantity)
                      // console.log(counttemp);
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
                    }else if (stock.name.indexOf(sub1.name) == -1) {
                        
                        // console.log(sub1.quantity)
                        stock.quantity.push(sub1.quantity);
                        setStock({quantity:[...stock.quantity, stock.quantity]});
                        // console.log(stock.quantity)
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
                            stock.finalPrice && stock.finalPrice.push(newW * sub1.quantity);
                        setStock({finalPrice:[...stock.finalPrice, stock.finalPrice]});
                        setSPrice(stock.finalPrice);
                        // let texts = sub1.weight;
                        //     const myArrays = texts.split(" ");
                        //     let newW = 0;
                        //     if(myArrays[1]=="gms"  || myArrays[1]=="ml")
                        //     {
                        //       newW = myArrays[0]/1000;
                        //     }
                        //     else{
                        //       newW = myArrays[0]
                        //     }
                        stock.finalWeight && stock.finalWeight.push(sub1.discountedPrice * sub1.quantity);
                        setStock({finalWeight:[...stock.finalWeight, stock.finalWeight]});
                        setSFinal(stock.finalWeight);
                        // console.log(stock.finalWeight)
                        // Object.assign(stock.name[index]=sub1.name)
                        // setStock({name:stock.name})
                        stock.name.push(sub1.name);
                        setStock({name:[...stock.name, stock.name]});
                        setSName(stock.name)

                        stock.pid.push(getCategory(sub1.name));
                        setStock({id:[...stock.pid, stock.pid]});
                        
                        // console.log(stock);
                    }
                    else{
                      console.log("Clicked");
                    }
                  
                })
            }
        })
    }catch (error) {
            }
            // setRefresh(false)
    
};
const getOrders = async () => {
  const response = await firebase.firestore().collection("categories");
  const data = await response.get();
  data.docs.forEach((item) => {
    category.push({ id: item.id, ...item.data() });
  });
  setCategory([...category, category]);
  // console.log(category);
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
       
      // name: item.name,
      name :  sName[sName.indexOf(item.name)]   ,
      category:item.categoryName,
      subCategory:item.subCategory,
      // quantity: qtemp = sQuantity[index],
      // weight: counttemp = weight[index],
        totalWeight : sprice[index] +  ((String(weight[sName.indexOf(item.name)]).substr(4,7) === "gms" ? "kg" :  String(weight[sName.indexOf(item.name)]).substr(2) )||(String(weight[sName.indexOf(item.name)]).substr(4,6) === "ml" ? "Litre" :  String(weight[sName.indexOf(item.name)]).substr(2) )),
      totalSale : sfinal[sName.indexOf(item.name)]
    }));

    // console.log(filteredData);
    exportPDF(filteredData);
  exportDataToXLSX(filteredData, "categorywisereport");
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

  const title = "Categorywise Report";
  const headers = [["Category Name","Sub Category Name","Product Name","Total Quantity", "Total Sale"]];

  const data = e.map((sub,index) =>{
      if (index+1 != catData.length) {
          if (sName.indexOf(sub.name) == 0) {
              // let text = weight[index]
              // const myArray = text.split(" ");
              // var temp=sQuantity[index]*myArray[0]
              // return([sub.category,sub.subCategory,sName[sName.indexOf(sub.name)],(sfinal[index]+" "+((weight[index].split(" ")[1] =="gms") ? "kg" : weight[index].split(" ")[1]) || ((weight[index].split(" ")[1] =="ml") ? "Litre" : weight[index].split(" ")[1]))])
              return([sub.category,sub.subCategory,sName[sName.indexOf(sub.name)],sprice[sName.indexOf(sub.name)] +  ((String(weight[sName.indexOf(sub.name)]).substr(4,7) === "gms" ? "kg" :  String(weight[sName.indexOf(sub.name)]).substr(2) )||(String(weight[sName.indexOf(sub.name)]).substr(4,6) === "ml" ? "Litre" :  String(weight[sName.indexOf(sub.name)]).substr(2) )),(sfinal[sName.indexOf(sub.name)])])
          }else{
              // let text = weight[index]
              // const myArray = text.split(" ");
              // var temp=sQuantity[index]*myArray[0]
              // return([sub.category,sub.subCategory,sName[sName.indexOf(sub.name)],(sfinal[index]+" "+((weight[index].split(" ")[1] =="gms") ? "kg" : weight[index].split(" ")[1]) || ((weight[index].split(" ")[1] =="ml") ? "Litre" : weight[index].split(" ")[1]))])
              return([sub.category,sub.subCategory,sName[sName.indexOf(sub.name)],sprice[sName.indexOf(sub.name)] +  ((String(weight[sName.indexOf(sub.name)]).substr(4,7) === "gms" ? "kg" :  String(weight[sName.indexOf(sub.name)]).substr(2) )||(String(weight[sName.indexOf(sub.name)]).substr(4,6) === "ml" ? "Litre" :  String(weight[sName.indexOf(sub.name)]).substr(2) )),(sfinal[sName.indexOf(sub.name)])])
          
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

  // console.log(content);
  // console.log(data);
  doc.text(title, marginLeft, 40);
  doc.autoTable(content);
  doc.save("categorywisereport.pdf")
}
  const view = async (data, rowId) => {
    history.push({
      pathname: "/users/user",
      state: data,
      id: rowId,
    });
  };
  const onChangeDate =  (e) => {
    porder=new Date(document.getElementById("date-to").value).setHours(23,59,59,999);
    order=new Date(document.getElementById("date-from").value).setHours(0,0,0,0);
    // setCategory([])
    setCatdata([])
    getUsers();
    // getOrders();
    setStock({
    name: ([]),
    quantity:([]),
    weight: ([]),
    pid:([]),
    finalWeight :([]),
    finalPrice:([])
  })
  setSName([])
  setSFinal([])
 
  // setSQuantity([])
  };
  const [status, setStatus] = useState("");
  const updatedStatus = async (s) => {
    setStatus(s);
    // console.log(s);
    // getUsers();
    // getVideos();1
  };

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
          <CCardHeader
            className="d-flex justify-content-between align-items-center"
            style={{
              fontWeight: "bold",
              backgroundColor: "#f7f7f7",
              fontSize: "1.1rem",
              color: "black",
            }}
          >
              <CCol sm="3">
                    <div className="font-xl">Category Wise Report</div>
                </CCol>
                <CCol sm="1">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        From:
                        <span><CInput type="date" id="date-from" name="date-input" placeholder="date"/></span>
                    </div>
                </CCol>
                <CCol sm="1">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        To:
                        <span><CInput type="date" id="date-to" name="date-input" placeholder="date" onChange={() => onChangeDate()}/></span>   
                    </div>
                </CCol>
                <CCol sm="2">
                    <div>
                        <CButton
                            color="info"
                            className="mr-3"
                            onClick={() => onExportData()}
                        >
                            Export Data
                        </CButton>
                    </div>
                </CCol>
            
              {/* <CButton
                color="primary"
                // onClick={() => history.push("/users/create-user")}
              >
                Create User
              </CButton> */}
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="2">
                  <CLabel htmlFor="inputEmail4">Category Name</CLabel>
                  </CCol>
                  <CCol md={4} sm="6" style={{marginTop:"-15px"}}>
                    <CDropdown className="mt-2">
                      <CDropdownToggle
                        style={{
                          border: "1px solid #d8dbe0",
                          borderRadius: "0.25rem",
                          width: "100%",
                          textAlign: "left"
                        }}
                        caret
                        varient={"outline"}
                       
                      >
                        {status ===""?"Select Category":status}
                      </CDropdownToggle>
                      <CDropdownMenu style={{ width: "100%",}}>
                        <CDropdownItem header>Select Category</CDropdownItem>
                        <CDropdownItem divider />
                        {
                          category.map((cat, index) => {
                            return (
                              <CDropdownItem
                              required
                                onClick={() => updatedStatus(cat.name)}
                              >
                                {cat.name}
                              </CDropdownItem>
                            );
                          })}
                      </CDropdownMenu>
                    </CDropdown>
                     {/* <CInput
                      required 
                      type="text"
                      placeholder="Society Name"
                      name="societyName"
                      value={formData.values.societyName}
                      onChange={(e) => {
                        formData.handleChange(e);
                        // setFormData({
                        //   ...formData.values,
                        //   name: e.target.value
                        // })
                      }}
                    /> */}
                </CCol> 
              </CRow> 

              <CRow>
            <CDataTable
                            loading={loading}
                            onColumnFilterChange={(e) => {
                                setTableFilters(e);
                            }}
                            onSorterValueChange={(e) => {
                                console.log(e);
                            }}
                            onTableFilterChange={(filter) => setTableFilters(filter)}
                            items={category}
                            fields={[
                                { key: "index", label:"Sr No", filter: false},
                                { key: "name", label: "Category Name", filter:true},
                                { key: "subAmount", label: "Category Total Amount", filter: true},
                                { key: "categoryName", label: "SubCategory Total Amount", filter:false},  
                            ]}
                            scopedSlots={{
                                index: (item,index) => {
                                    return (
                                        <td>{index+1}
                                        </td>
                                    );
                                },
                                name:(item)=>{
                                  return(
                                      <td>
                                          {
                                              item.name
                                          }
                                      </td>
                                  );
                              },
                              subAmount:(item)=>{
                                let wallet = 0;
                                let quant = 0;
                                catData.map((sub)=>{
                                  // console.log(sub);
                                  if(sub.categoryName == item.name){
                                    wallet = wallet + sfinal[sName.indexOf(sub.name)]
                                  }
                                })
                                  return(
                                      <td><b>₹</b>
                                          {
                                            wallet
                                          }
                                      </td>
                                  );
                              },
                              categoryName:(item)=>{
                                return(
                                <td>
                                  {
                                    item.name == status?
                                      item.subCategory.map((sub1)=>{
                                        let wallet = 0;
                                        // console.log(sub1);
                                        catData.map((sub)=>{
                                          // console.log(sub);
                                          if(sub.subCategory == sub1){
                                            wallet = wallet + sfinal[sName.indexOf(sub.name)]
                                          }
                                        })
                                        return(
                                          <div><span>{sub1} : </span><b>₹</b>
                                              {
                                                wallet
                                              }
                                          </div>
                                      );
                                      })                                     
                                    :
                                        <div hidden>
                                        </div>
                                    }
                                </td>
                                // item.map((sub)=>{
                                  
                                // })
                                );
                              },
                                // name:(item,index)=>{
                                //     if (index+1 != catData.length) {
                                //     // let text = weight[index];
                                //     // const myArray = text.split(" ");
                                //     // var temp=sQuantity[index]*myArray[0]
                                //     return(
                                //         <td>
                                //             {
                                //             <div>
                                //             {/* {item.name} : {sfinal[index]+((weight[index].split(" ")[1] =="gms") ? "kg" : weight[index].split(" ")[1]) || ((weight[index].split(" ")[1] =="ml") ? "Litre" : weight[index].split(" ")[1])}
                                //             <br></br> */}
                                //             {item.name} :<b>₹</b>
                                //             {sfinal[sName.indexOf(item.name)] }   
                                //             </div>
                                //             }
                                //         </td>
                                //     );
                                //     }else 
                                //     return(
                                //         <td>
                                //         </td>
                                //     )
                                // },
                            }}
                            hover
                            striped
                            columnFilter
                            sorter
                            pagination
                            itemsPerPage={30}
                            clickableRows
                            />
            </CRow>

            <CCardHeader
                    className="d-flex justify-content-between align-items-center"
                    style={{
                    fontWeight: "bold",
                    backgroundColor: "#f7f7f7",
                    fontSize: "1.1rem",
                    color: "black",
                    }}
                > Product Report

            
              {/* <CButton
                color="primary"
                // onClick={() => history.push("/users/create-user")}
              >
                Create User
              </CButton> */}
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
                                    // let text = weight[index];
                                    // const myArray = text.split(" ");
                                    // var temp=sQuantity[index]*myArray[0]
                                    return(
                                        <td>
                                            {
                                            <div>
                                            {/* {item.name} : {sfinal[index]+((weight[index].split(" ")[1] =="gms") ? "kg" : weight[index].split(" ")[1]) || ((weight[index].split(" ")[1] =="ml") ? "Litre" : weight[index].split(" ")[1])}
                                            <br></br> */}
                                            {item.name} : {sprice[sName.indexOf(item.name)] +  (String(weight[sName.indexOf(item.name)]).substr(4,7) === "gms" ? "kg" :  String(weight[sName.indexOf(item.name)]).substr(2) )}
                                            <div><b>₹</b>
                                            {sfinal[sName.indexOf(item.name)] }  </div>
                                            
                                            </div>
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
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default HotelReport;