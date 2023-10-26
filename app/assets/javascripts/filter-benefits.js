window.GOVUKPrototypeKit.documentReady(() => {
  var benefitsPreferences = document.querySelector('.your-situation-saved-mode'),
    benefitsForm = document.querySelector('.your-situation-edit-mode'),
    benfitsFormToggleButton = document.querySelector('#changeLink'),
    benefitsFormSaveButton = document.querySelector('#saveLink')
  var benefitsList = []

  benefitsPreferences.hidden = true

  const updateBenefitsList = (target) => {
    if (target.checked) {
      benefitsList.push(target.dataset.value)
    } else {
      benefitsList = benefitsList.filter((item) => item !== target.dataset.value)
    }
  }

  const updateBenefitsPreferencesUI = () => {
    benefitsPreferences.querySelector('.govuk-summary-list').innerHTML = ''

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
      benefitsPreferences.hidden = false
      benefitsForm.hidden = true
    } else {
      benefitsPreferences.hidden = true
      benefitsForm.hidden = false
    }
  }

  benfitsFormToggleButton.addEventListener('click', (e) => toggleBenefitsFormSectionsUI(e))

  benefitsFormSaveButton.addEventListener('click', (e) => {
    e.preventDefault()
    benefitsPreferences.hidden = false
    benefitsForm.hidden = true
  })

  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('govuk-checkboxes__input')) return
    updateBenefitsList(e.target)
    updateBenefitsPreferencesUI()
  })
})
