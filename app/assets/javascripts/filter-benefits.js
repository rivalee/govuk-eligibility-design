window.GOVUKPrototypeKit.documentReady(() => {
  class MyForm {
    constructor(id) {
      this.formId = id
      this.form = document.querySelector(`#${this.formId}`)
      this.savedMode = this.form.querySelector('.saved-mode')
      this.formMode = this.form.querySelector('.form-mode')
      this.formMode.hidden = true
      this.formToggle = this.form.querySelector('.change')

      this.formToggle.addEventListener('click', (e) => this.toggleVisibility(e))

      this.toggleVisibility = (e) => {
        if (this.formMode.hidden) {
          this.toggleSettings(e, 'Cancel', true, false)
        } else {
          this.toggleSettings(e, 'Change', false, true)
        }
      }

      this.toggleSettings = (e, toggleText, savedModeIsVisible, formModeIsVisible) => {
        e.preventDefault()
        this.formToggle.textContent = toggleText
        this.savedMode.hidden = savedModeIsVisible
        this.formMode.hidden = formModeIsVisible
      }
    }
  }

  class MySituationForm extends MyForm {
    constructor(id) {
      super(id)
      this.benefitsList = ['I look after someone', "I'm state pension age"]
      this.savePreferences = this.form.querySelector('.save')
      this.savePreferences.addEventListener('click', (e) => this.toggleSettings(e, 'Change', false, true))

      this.form.addEventListener('click', (e) => {
        if (!e.target.classList.contains('govuk-checkboxes__input')) return
        this.updateBenefitsList(e.target)
        this.updateSummary()
      })

      this.updateBenefitsList = (target) => {
        if (target.checked) {
          this.benefitsList.push(target.dataset.value)
        } else {
          this.benefitsList = this.benefitsList.filter((item) => item !== target.dataset.value)
        }
      }

      this.updateSummary = () => {
        this.savedMode.querySelector('.govuk-summary-list').innerHTML = ''

        if (!this.benefitsList.length) return
        this.benefitsList.map((benefit) => {
          var div = document.createElement('div')
          div.className += `govuk-summary-list__row`
          div.innerHTML = `<dd class="govuk-summary-list__value">${benefit}</dd>`
          this.savedMode.querySelector('.govuk-summary-list').appendChild(div)
        })
      }
    }
  }

  class MyInformationForm extends MyForm {
    constructor(id) {
      super(id)
      this.myForm = this.form.querySelector('#myForm')
      this.myInformation = { 'are_you_in_temporary,_sheltered_or_supported_housing': 'No', are_you_looking_for_work: 'No' }
      this.myDates = { 'what_is_your_date_of_birth[day]': '01', 'what_is_your_date_of_birth[month]': '11', 'what_is_your_date_of_birth[year]': '1961', 'are_you_in_temporary,_sheltered_or_supported_housing': 'No', are_you_looking_for_work: 'No' }
      this.dateObject

      this.myForm.addEventListener('submit', (e) => {
        e.preventDefault()
        let formData = new FormData(e.target)
        let formObject = Object.fromEntries(formData.entries())

        this.myInformation = this.createInformationObject(formObject)
        this.myDates = this.createDateObject(formObject)
        this.dateObject = this.createDate()

        this.toggleSettings(e, 'Change', false, true)
        this.updateSummary()
      })
      this.formatKey = (key) => key.split('_').join(' ')
      this.updateSummary = () => {
        this.savedMode.querySelector('.govuk-summary-list').innerHTML = ''

        if (this.createDate()) {
          var div = document.createElement('div')
          div.className += `govuk-summary-list__row`
          div.innerHTML = `
            <dd class="govuk-summary-list__value is-capitalised">what is the date?</dd>
            <dd class="govuk-summary-list__value">${this.dateObject.toDateString()}</dd>
          `
          this.savedMode.querySelector('.govuk-summary-list').appendChild(div)
        }

        for (const [key, value] of Object.entries(this.myInformation)) {
          var div = document.createElement('div')
          div.className += `govuk-summary-list__row`
          div.innerHTML = `
              <dd class="govuk-summary-list__value is-capitalised">${this.formatKey(key)}?</dd>
              <dd class="govuk-summary-list__value">${value}</dd>
            `
          this.savedMode.querySelector('.govuk-summary-list').appendChild(div)
        }
      }
      this.createInformationObject = (formObject) => {
        return Object.keys(formObject)
          .filter((key) => !key.includes('what_is_your_date_of_birth'))
          .reduce((cur, key) => Object.assign(cur, { [key]: formObject[key] }), {})
      }
      this.createDate = () => (this.dateObject = new Date(this.myDates['what_is_your_date_of_birth[year]'], parseInt(this.myDates['what_is_your_date_of_birth[month]']) - 1, this.myDates['what_is_your_date_of_birth[day]']))
      this.createDateObject = (formObject) => {
        return Object.keys(formObject)
          .filter((key) => key.includes('what_is_your_date_of_birth'))
          .reduce((cur, key) => Object.assign(cur, { [key]: formObject[key] }), {})
      }
    }
  }

  formViews = document.querySelectorAll('.main-form')
  Array.from(formViews, (view) => {
    if (view.id === 'mySituationForm') {
      var mySituationForm = new MySituationForm(view.id)
      mySituationForm.updateSummary()
    } else if (view.id == 'myInformationForm') {
      myInformationForm = new MyInformationForm(view.id)
      myInformationForm.updateSummary()
    } else {
      new MyForm(view.id)
    }
  })
})
