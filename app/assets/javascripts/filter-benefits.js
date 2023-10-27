window.GOVUKPrototypeKit.documentReady(() => {
  var benefitsList = ['I look after someone', "I'm state pension age"]
  var benefitsPreferences = document.querySelector('.your-situation-saved-mode'),
    benefitsForm = document.querySelector('.your-situation-edit-mode'),
    benfitsFormToggleButton = document.querySelector('#changeLink'),
    benefitsFormSaveButton = document.querySelector('#saveLink')

  const updateBenefitsList = (target) => {
    if (target.checked) {
      benefitsList.push(target.dataset.value)
    } else {
      benefitsList = benefitsList.filter((item) => item !== target.dataset.value)
    }
  }

  const updateBenefitsPreferencesUI = () => {
    benefitsPreferences.querySelector('.govuk-summary-list').innerHTML = ''

    if (!benefitsList.length) return
    benefitsList.map((benefit) => {
      var div = document.createElement('div')
      div.className += `govuk-summary-list__row`
      div.innerHTML = `
        <dd class="govuk-summary-list__value">${benefit}</dd>
      `
      benefitsPreferences.querySelector('.govuk-summary-list').appendChild(div)
    })
  }

  const toggleBenefitsFormSectionsUI = (e) => {
    e.preventDefault()
    if (benefitsPreferences.hidden) {
      benfitsFormToggleButton.textContent = 'Change'
      benefitsPreferences.hidden = false
      benefitsForm.hidden = true
    } else {
      benfitsFormToggleButton.textContent = 'Cancel'
      benefitsPreferences.hidden = true
      benefitsForm.hidden = false
    }
  }

  benfitsFormToggleButton.addEventListener('click', (e) => toggleBenefitsFormSectionsUI(e))

  benefitsFormSaveButton.addEventListener('click', (e) => {
    e.preventDefault()
    benfitsFormToggleButton.textContent = 'Change'
    benefitsPreferences.hidden = false
    benefitsForm.hidden = true
  })

  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('govuk-checkboxes__input')) return
    updateBenefitsList(e.target)
    updateBenefitsPreferencesUI()
  })

  benefitsForm.hidden = true
  updateBenefitsPreferencesUI()
})
