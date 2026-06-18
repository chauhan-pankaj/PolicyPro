import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export type LanguageCode = 'en' | 'hi' | 'ur';

export interface Translations {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLanguage = signal<LanguageCode>('en');
  
  readonly languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'ur', label: 'اردو' }
  ];

  private translations: { [lang: string]: Translations } = {
    'en': {
      // Member Selection
      'get_0_gst': 'Get 0% GST now with upto 25% extra discount',
      'male': 'Male',
      'female': 'Female',
      'select_members': 'Select members you want to insure',
      'self': 'Self',
      'wife': 'Wife',
      'husband': 'Husband',
      'son': 'Son',
      'daughter': 'Daughter',
      'father': 'Father',
      'mother': 'Mother',
      'more_members': 'More members',
      'continue': 'Continue',
      'privacy_policy': 'Privacy Policy',
      'terms_of_use': 'Terms of Use',
      'agree_text': 'By clicking on \'Continue\', you agree to our',

      // Member Age
      'select_ages': 'Enter age for each member',
      'best_pricing': 'Best Pricing',
      'all_ages_required': 'Please enter age for all members',

      // Contact Details
      'contact_information': 'Enter your contact information',
      'full_name': 'Full Name',
      'mobile_number': 'Mobile Number',
      'pincode': 'Pincode',
      'email': 'Email',

      // Quote Results
      'available_plans': 'Available Plans',
      'choose_best_plan': 'Choose the best plan for your family',
      'sum_insured': 'Sum Insured',
      'insurer': 'Insurer',
      'family_type': 'Family Type',
      'all_insurers': 'All Insurers',
      'all_types': 'All Types',
      'buy_now': 'Buy Now',
      'cashless_hospitals': 'Cashless Hospitals',
      'claim_settlement': 'Claim Settlement',
      'back_to_home': 'Back to Home'
    },
    'hi': {
      // Member Selection
      'get_0_gst': '0% जीएसटी के साथ 25% तक अतिरिक्त छूट पाएं',
      'male': 'पुरुष',
      'female': 'महिला',
      'select_members': 'उन सदस्यों को चुनें जिन्हें बीमा कराना चाहते हैं',
      'self': 'स्वयं',
      'wife': 'पत्नी',
      'husband': 'पति',
      'son': 'बेटा',
      'daughter': 'बेटी',
      'father': 'पिता',
      'mother': 'माता',
      'more_members': 'अधिक सदस्य',
      'continue': 'जारी रखें',
      'privacy_policy': 'गोपनीयता नीति',
      'terms_of_use': 'उपयोग की शर्तें',
      'agree_text': '\'जारी रखें\' पर क्लिक करने से आप हमारे से सहमत हैं',

      // Member Age
      'select_ages': 'प्रत्येक सदस्य की आयु दर्ज करें',
      'best_pricing': 'सर्वश्रेष्ठ मूल्य निर्धारण',
      'all_ages_required': 'कृपया सभी सदस्यों की आयु दर्ज करें',

      // Contact Details
      'contact_information': 'अपनी संपर्क जानकारी दर्ज करें',
      'full_name': 'पूरा नाम',
      'mobile_number': 'मोबाइल नंबर',
      'pincode': 'पिन कोड',
      'email': 'ईमेल',

      // Quote Results
      'available_plans': 'उपलब्ध योजनाएं',
      'choose_best_plan': 'अपने परिवार के लिए सर्वश्रेष्ठ योजना चुनें',
      'sum_insured': 'बीमित राशि',
      'insurer': 'बीमाकर्ता',
      'family_type': 'पारिवारिक प्रकार',
      'all_insurers': 'सभी बीमाकर्ता',
      'all_types': 'सभी प्रकार',
      'buy_now': 'अभी खरीदें',
      'cashless_hospitals': 'कैशलेस अस्पताल',
      'claim_settlement': 'दावा निपटान',
      'back_to_home': 'घर लौटें'
    },
    'ur': {
      // Member Selection
      'get_0_gst': '0% GST کے ساتھ 25% تک اضافی رعایت حاصل کریں',
      'male': 'مرد',
      'female': 'خاتون',
      'select_members': 'ان افراد کو منتخب کریں جن کا بیمہ کرانا چاہتے ہیں',
      'self': 'خود',
      'wife': 'بیوی',
      'husband': 'شوہر',
      'son': 'بیٹا',
      'daughter': 'بیٹی',
      'father': 'باپ',
      'mother': 'ماں',
      'more_members': 'مزید اراکین',
      'continue': 'جاری رکھیں',
      'privacy_policy': 'رازداری کی پالیسی',
      'terms_of_use': 'استعمال کی شرائط',
      'agree_text': '\'جاری رکھیں\' پر کلک کرنے سے آپ ہماری سے رضامند ہیں',

      // Member Age
      'select_ages': 'ہر فرد کی عمر درج کریں',
      'best_pricing': 'بہترین قیمت',
      'all_ages_required': 'براہ کرم تمام اراکین کی عمر درج کریں',

      // Contact Details
      'contact_information': 'اپنی رابطے کی معلومات درج کریں',
      'full_name': 'مکمل نام',
      'mobile_number': 'موبائل نمبر',
      'pincode': 'پن کوڈ',
      'email': 'ای میل',

      // Quote Results
      'available_plans': 'دستیاب منصوبے',
      'choose_best_plan': 'اپنے خاندان کے لیے بہترین منصوبہ منتخب کریں',
      'sum_insured': 'بیمہ شدہ رقم',
      'insurer': 'بیمہ کنندہ',
      'family_type': 'خاندانی قسم',
      'all_insurers': 'تمام بیمہ کنندے',
      'all_types': 'تمام اقسام',
      'buy_now': 'اب خریدیں',
      'cashless_hospitals': 'کیش رہت اسپتال',
      'claim_settlement': 'دعویٰ بندوبست',
      'back_to_home': 'گھر واپس'
    }
  };

  setLanguage(language: LanguageCode): void {
    this.currentLanguage.set(language);
  }

  translate(key: string): string {
    const lang = this.currentLanguage();
    return this.translations[lang]?.[key] || this.translations['en']?.[key] || key;
  }

  getTranslations() {
    return this.translations[this.currentLanguage()];
  }
}
