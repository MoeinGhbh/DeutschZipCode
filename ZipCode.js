import {html, render} from 'lit-html';


class ZipCode extends HTMLElement {

    constructor(){
        super();
        this.shadow = this.attachShadow({"mode":"open"})

        const zipcodetemplate = html` <input type="text" pattern="[0-9]*" name="zip" id="zip"  >`
        const citytemplate =  html`   <input type="text" name="city" id="city">`
        const streettemplate = html`  <select id="street" name="street" ></select>`


        const template = html`

<style>
html, body {
  margin: 100;
  height: 50%;
  padding: 30px;
  font-family: Arial, sans-serif;
  font-size: 16px;
  width: 50%;
}

label { display: block; }
input {
  display: block;
  width: 100%;
  padding: 8px 5px;
  border: 1px solid #CCC;
}
button {
  display: inline-block;
  width: 49%;
  padding: 8px;
}
textarea {
  width: 50%;
  height: 50%;
}
#top {
  height: 40%;
  position: relative;

}
#bottom {
  height: 100%;
  margin-top: -180px;
  padding-top: 180px;
}
</style>





<div id="top">

<form id="myForm" action="#" class="fancy-form">

<fieldset>
<legend>Address</legend>

<table>
<tr>
    <td>
   
        <div class="zip-wrap">
            <label for="zip-1">Zip</label>
           ${zipcodetemplate}
           
        </div>
    </td>

    <td>
      <div class="city-wrap">
        <label for="city">City</label> 
        ${citytemplate}
      </div>
    </td>
</tr>
      <tr>
        <td>
          <div>
              <label for="address-line-1">Street</label>
             ${streettemplate}
          </div>
        </td>
        <td>
            <div class="houseNumber-wrap">
                <label for="house-number">House Number</label>
                <input type="text" name="houseNumber" id="houseNumber">
            </div>
        </td>
      </tr>

  <tr>
      <td colspan="2">
            <div class="country-wrap">
                    <label for="Country">Country</label>
                    <input type="text" name="country" id="country">
            </div>
      </td>
  </tr>

</table>

<div>
<button id="toggle-info">Show Info</button>
</div>


</fieldset>


</form>
</div>
`

        render(template,this.shadowRoot)

    }
    

    
    findZipCode() {
      var cityName=''
      const zip = this.shadowRoot.querySelector('#zip');
      const city = this.shadowRoot.querySelector('#city');
      var alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l',
      'm','n','o','p','q','r','s','t','u','v','w','x','y','z','ä','ö','ü'];
      var x;
      for (x of alphabets) {
                                              fetch("https://www.postdirekt.de/plzserver/PlzAjaxServlet?autocomplete=plz&plz_city="+x,
                                              {
                                                method:'get'
                                                    })
                                                    .then(response => response.json())
                                                    .then((response) => { 
                                                return response.json().then((data) => {
                                                    const mydata = data
                                                    // console.log(data)
                                                    var i = 0;
                                                    var len = data["rows"].length;
                                                    for (; i < len; ) {
                                                      if ((data["rows"][i]["plz"]).split(/([0-9]+)/)[1]==String(zip.value).slice(0,(data["rows"][i]["plz"]).split(/([0-9]+)/)[1].length))
                                                        {
                                                          city.value=data["rows"][i]["city"]
                                                          cityName=data["rows"][i]["city"]
                                                          break;
                                                        }
                                                      i++;
                                                    }
                                                    return data;
                                                })})
                                                .catch(function(error){
                                                            console.log(error)
                                                    })
                                      }


                                      var alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','ä','ö','ü'];
                                      var x;
                                      
                                      for (var j=0;j<alphabets.length;j++)
                                      {
                                        console.log(cityName,'ssssssssssssssssss')
                                                console.log("https://www.postdirekt.de/plzserver/PlzAjaxServlet?autocomplete=street&plz_city="+city.value+"&plz_plz="+zip.value+"&plz_district=&plz_street="+alphabets[j])
                                                                      fetch("https://www.postdirekt.de/plzserver/PlzAjaxServlet?autocomplete=street&plz_city="+city.value+"&plz_plz="+zip.value+"&plz_district=&plz_street="+alphabets[j],
                                                                              {
                                                                                method:'get'
                                                                                    }).then((response) => { 
                                                                                return response.json().then((data) => {
                                                                                    const mydata = data
                                                                                    console.log(data,'second')
                                                                                    console.log(zip.value)
                                                                                    
                                                                                    

                                                                                    
                                                                                    var addStreet = this.shadowRoot.querySelector('#street');

                    
                                                  for (var r=0;r<data["rows"].length;r++)
                                                                  {
                                                  addStreet.options[addStreet.options.length] = new Option(data["rows"][r]["street"], data["rows"][r]["street"]);
                                                                  }
                                                                                  })})
                                      }
    }

    ShowInfo(){
      const zip = this.shadowRoot.querySelector('#zip').value;
      const street = this.shadowRoot.querySelector('#street').value;
      const country = this.shadowRoot.querySelector('#country').value;
      const houseNumber = this.shadowRoot.querySelector('#houseNumber').value;
      const city = this.shadowRoot.querySelector('#city').value;

      
      console.log(street,city,country,zip,houseNumber);

      console.log(`   The Street is  ${street} 
                      and city is ${city}
                      and House Number ${houseNumber}
                      and country is ${country}
                      and zip is ${zip}.`);
      alert(`         The Street is  ${street} 
                      and city is ${city}
                      and House Number ${houseNumber}
                      and country is ${country}
                      and zip is ${zip}.`)
    }


    connectedCallback() {
      this.shadowRoot.querySelector('#zip')
      .addEventListener('blur', () => this.findZipCode());

      this.shadowRoot.querySelector('#toggle-info')
      .addEventListener('click', () => this.ShowInfo());

    }

    disconnectedCallback() {
      this.shadowRoot.querySelector('#zip').removeEventListener();
    }

}

window.customElements.define("zip-code",ZipCode)