'use client';
import BenfordsLawChart from './BenfordsLawChart';
import ShapiroNormalityChart from './ShapiroNormalityChart';
import DataValidationKDE from "./DataValidationKDE";
import PaymentMethodBoxplot from './PaymentMethodBoxplot';
import GenderPairplot from './GenderPairplot';


export default function DataValidationSummary() {
  return (
    <div className="space-y-14">
      <section className='p-4 shadow border border-gray-300 rounded'>
        <DataValidationKDE />
      </section>
      <section className='p-4 shadow border border-gray-300 rounded'>
        <BenfordsLawChart />
      </section>
      <section className='p-4 shadow border border-gray-300 rounded'>
        <PaymentMethodBoxplot />
      </section>
      <section className='p-4 shadow border border-gray-300 rounded'>
        <ShapiroNormalityChart />
      </section>
      <section className='p-4 shadow border border-gray-300 rounded'>
        <GenderPairplot />
      </section>
      <section>
        <h2 className="font-bold text-2xl mt-10">Conclusion</h2>
        <p className="mt-2" style={{ textAlign: "justify" }}>
          Collectively, the analyses reveal a dataset that lacks the variability, irregular patterns, and natural relationships characteristic of genuine customer behavior. The uniformity in distributions, absence of distinct group differences, failure to follow established statistical laws, and lack of organic correlations all point unambiguously to synthetic data generation. These findings underscore that the data serves as a demonstration or training resource, not as a reflection of real-world commercial transactions or customer diversity.
        </p>
      </section>
    </div>
  );
}
