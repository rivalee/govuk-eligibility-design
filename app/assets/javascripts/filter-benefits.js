window.GOVUKPrototypeKit.documentReady(() => {
  class MyForm {
    constructor(id) {
      this.formId = id
      this.form = document.querySelector(`#${this.formId}`)
      this.formMode = this.form.querySelector('.form-mode')
      this.formToggle = this.form.querySelector('.change')
      this.savedMode = this.form.querySelector('.saved-mode')
      this.savePreferences = this.form.querySelector('.save')

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
        if (this.formToggle.hidden) this.formToggle.hidden = false
        this.formToggle.textContent = toggleText
        this.savedMode.hidden = savedModeIsVisible
        this.formMode.hidden = formModeIsVisible

        this.formToggle.setAttribute('aria-expanded', this.formToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true')
        this.savePreferences.setAttribute('aria-expanded', this.savePreferences.getAttribute('aria-expanded') === 'true' ? 'false' : 'true')
      }

      this.updateTemplate = (key, value) => {
        var div = document.createElement('div')
        div.className += `govuk-summary-list__row`
        if (key) {
          div.innerHTML = `<dd class="govuk-summary-list__value key-formatting">${key}</dd>`
        }
        div.innerHTML += `<dd class="govuk-summary-list__value">${value}</dd>`
        this.savedMode.querySelector('.govuk-summary-list').appendChild(div)
      }
    }
  }

  class MySituationForm extends MyForm {
    constructor(id) {
      super(id)
      this.formMode.hidden = true
      this.myOptions = ["I'm over state pension age", 'I look after someone']

      this.savePreferences.addEventListener('click', (e) => this.toggleSettings(e, 'Change', false, true))

      this.form.addEventListener('click', (e) => {
        if (!e.target.classList.contains('govuk-checkboxes__input')) return
        this.updateMyOptions(e.target)
        this.updateSummary()
      })

      this.updateMyOptions = (target) => {
        if (target.checked) {
          this.myOptions.push(target.dataset.value)
        } else {
          this.myOptions = this.myOptions.filter((item) => item !== target.dataset.value)
        }
      }

      this.updateSummary = () => {
        this.savedMode.querySelector('.govuk-summary-list').innerHTML = ''
        if (!this.myOptions.length) return
        this.myOptions.map((option) => this.updateTemplate('', option))
      }
    }
  }

  class MyInformationForm extends MyForm {
    constructor(id) {
      super(id)
      this.formToggle.hidden = true
      this.myForm = this.form.querySelector('#myForm')
      this.myInformation = {
        'are_you_in_temporary,_sheltered_or_supported_housing': 'No',
        are_you_looking_for_work: 'No',
        "do_you_already_get_universal_credit,_pension_credit,_housing_benefit,_or_income-based_job_seeker's_allowance,_pension_credit,_or_housing_benefit": 'No',
      }
      this.myDates = { 'what_is_your_date_of_birth[day]': '01', 'what_is_your_date_of_birth[month]': '11', 'what_is_your_date_of_birth[year]': '1961', 'are_you_in_temporary,_sheltered_or_supported_housing': 'No', are_you_looking_for_work: 'No' }
      this.dateObject
      this.savedMode.hidden = true

      this.myForm.addEventListener('submit', (e) => {
        e.preventDefault()
        // Updates saved values based on submitted form data

        // let formData = new FormData(e.target)
        // let formObject = Object.fromEntries(formData.entries())

        // this.myInformation = this.createInformationObject(formObject)
        // this.myDates = this.createDateObject(formObject)
        // this.dateObject = this.createDate()

        this.toggleSettings(e, 'Change', false, true)
        // this.updateSummary()
      })

      this.formatKey = (key) => key.split('_').join(' ')

      this.updateSummary = () => {
        this.savedMode.querySelector('.govuk-summary-list').innerHTML = ''
        if (this.createDate()) this.updateTemplate('what is your date of birth', this.dateObject.toDateString())
        for (const [key, value] of Object.entries(this.myInformation)) this.updateTemplate(this.formatKey(key), value)
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

  views = document.querySelectorAll('.view')
  Array.from(views, (view) => {
    if (view.id === 'mySituationForm') {
      var mySituationForm = new MySituationForm(view.id)
      mySituationForm.updateSummary()
    } else if (view.id == 'myInformationForm') {
      myInformationForm = new MyInformationForm(view.id)
      // myInformationForm.updateSummary()
    } else {
      new MyForm(view.id)
    }
  })
})
