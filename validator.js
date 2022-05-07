//Hàm Validator
function Validator(options) {
    function getParent(element, selector) {
        // nếu element có thằng chứa nó tránh TH là element cuối cùng
        while(element.parentElement){
            //kiểm tra thằng cha nó có phải là form-group ko
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
        //Cứ mỗi lần tìm kiếm thì lấy thằng thẻ cha làm thẻ con để tìm kiếm tiếp
    }
    var selectorRules = {
    };


//Hàm thực hiện Validate
    function validate(inputElement, rule) {
        
        //result will return in test: function(inputElement.value)
        //if(have value pass in)
        //notice:Undefine
        //else
        //notice:'vui long nhap truong nay' and add class contain color for box input
// var errorElement = getParent(inputElement, '.form-group')
// erorElement = ham getparent phần tử truyền vào và form-group (thẻ cha cần tìm) và trỏ đến form-message
 var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
     var errorMessage;
    //get all of rules of selector
     var rules = selectorRules[rule.selector];
    //lặp qua từng rule và kiêm tra
     for (var i=0; i < rules.length; ++i){
    //bởi vì input name=gender có value là male/female/other nên ô input có value nên ko xuất hiện lỗi\
    //sử dụng switch kiểm tra nếu có TH đó có type là radio hoặc checkbox thì break
      switch (inputElement.type) {
          case 'checkbox':
          case 'radio':
            errorMessage = rules[i](
                formElement.querySelector(rule.selector + ':checked')
            )
              break;
        default:
            errorMessage = rules[i](inputElement.value)
      }

    //Nếu có lỗi thì dừng kiểm tra
         if(errorMessage) break;
     }
     
     if(errorMessage){
          errorElement.innerText = errorMessage;
          getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        }else{
           errorElement.innerText = ''
          getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }
        //Nếu xuất hiện lỗi thì có
        //ko có thì flase
        return !errorMessage;
    }
//Xử lý các sựu kiện
  var formElement = document.querySelector(options.form)
       if(formElement){
           //Khi submit form (all rule)
           formElement.onsubmit = function(e) {
                  e.preventDefault();

        var isFormValid = true;

           //Lặp qua từng rule và Validate
                  options.rules.forEach(function(rule) {
                    var inputElement = formElement.querySelector(rule.selector)
                    var isValid = validate(inputElement, rule);
                    if(!isValid){
                        isFormValid = false;
                    }
                  });

                  if(isFormValid){
                      //TH với js
                      if(typeof options.onSubmit === 'function') {
                          //   Lấy ra những thằng có fill là name(thường có trong input) và ko có disabled(disa = ko tương tác)
                          var enableInputs = formElement.querySelectorAll('[name]')
                          //covert enableInput sang Array
                          var formValues = Array.from(enableInputs).reduce(function(values, input){
                            switch (input.type){
                             case 'radio':
                             case 'checkbox':
                                 if(input.matches(':checked')){
                                     values[input.name] = input.value;
                                 }
                                 break;
                            default: values[input.name] = input.value
                            }
                            return values;
                            }, {});
                        options.onSubmit(formValues)
                    }
                    //TH với hành vi mặc định
                    else{
                        formElement.submit();
                    }
                  }
           }
           //lặp qua mỗi rule và xử lý sự kiện(blur, input,...)
         options.rules.forEach(function (rule){
             //save rules for input
             if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
             }else{
                 selectorRules[rule.selector] = [rule.test]
             }
               var inputElement = formElement.querySelector(rule.selector)
               var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
               if(inputElement) {
                   //handling when onblur
                   inputElement.onblur = function() {
//when user onblur at inputElement(mean rule.selector)
//it will practice Validate function
                      validate(inputElement, rule)
                   }
                  inputElement.oninput = function(){
                    //handling input value(remove notice error when user input value into box input)
                errorElement.innerText = ''
                getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                }
             }
        })
        // console.log(selectorRules)
    }
} 
//Định Nghĩa
//Nguyên tắc của các rules:
//1. Khi có lỗi => Trả ra message lỗi
//2. Khi hợp lễ => Không trả lời ra cái gì(cho undifined)
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
           return value ? undefined : message || 'Vui lòng nhập trường này'
        }
    };
}
Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
           return regex.test(value) ? undefined : message || 'Vui lòng nhập email'
        }
    };
}
Validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `Mật khẩu tối đa ${min} kí tự`
        }
    }
}
Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value == getConfirmValue() ? undefined : message || 'Giá trị nhập vào không giống nhau'
        }
    }
}
// message value is value we can change , apply every case when we add into