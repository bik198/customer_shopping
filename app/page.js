'use client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  return (
    <section
      className="relative flex flex-col justify-between items-center min-h-[85vh] px-4 py-4
                 bg-[url('/shopping-bg.png')] bg-cover bg-no-repeat bg-center">
      {/* content wrapper */}
      <div className="relative w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold my-8 mt-12 text-center text-slate-900">
          Customer Shopping Behavior Analysis Dashboard
        </h1>

        <p
          className="text-lg text-gray-700 mb-6"
          style={{ textAlign: 'justify' }}
        >
          This dashboard explores patterns in customer shopping behavior using a
          multi-featured dataset from Kaggle, combining demographic, product,
          engagement, and transaction data. Our main goal is to build and
          interpret predictive models for <b>customer spending</b>, enabling
          actionable insights for segmentation, marketing, and experience
          optimization.
        </p>

        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded shadow text-blue-900 text-base w-full">
          <b>Dataset:</b>{' '}
          <a
            href="https://www.kaggle.com/datasets/rehan497/customer-shopping-behavior-dataset"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600"
          >
            Customer Shopping Behavior Dataset (Kaggle)
          </a>
          <ul className="list-disc pl-6 mt-2 text-blue-900">
            <li>
              <b>Rows:</b> Each entry is a unique customer shopping data
            </li>
            <li>
              <b>Key Features:</b> Age, Gender, Location, Product, Category,
              Purchase Amount, Size, Color, Season, Subscription, Discounts,
              Reviews, Shipping Type, Payment, Frequency, Previous Purchases
            </li>
            <li>
              <b>Target Variable:</b> <b>Purchase Amount (USD)</b>
            </li>
          </ul>
        </div>

        <div className="mb-5 p-4 rounded border border-blue-200 text-base bg-blue-50 w-full">
          <b>Analysis Workflow:</b>
          <ul className="list-disc pl-6 mt-1">
            <li>
              <b>Preprocessing:</b> Clean, encode, and scale features as well as
              handle missingness and imbalances in the Dataset
            </li>
            <li>
              <b>Modeling:</b> Predict purchase amounts using PCA, linear
              regression, random forest, and data analysis. Also, assess using
              EDA, RMSE, MAE, and R²
            </li>
            <li>
              <b>Interpretation:</b> Highlight top factors influencing customer
              spending to conclude deliver actionable visual and narrative
              insights
            </li>
          </ul>
          <b>Challenges:</b>
          <ul className="list-disc pl-6 mt-1">
            <li>
              Feature engineering: Cleaning, transforming, and encoding complex
              fields
            </li>
            <li>
              Synthetic data limitations: Our analysis demonstrated that the
              dataset was artificially generated, which led to a{' '}
              <b>negative R² value</b> in regression modeling. Despite multiple
              attempts with advanced preprocessing and alternative models, we
              could not achieve a positive R², indicating a lack of real-world
              patterns and predictive signal in the data.
            </li>
          </ul>
        </div>

        {/* button block with small bottom padding only */}
        <div className="flex flex-col items-center pb-2">
          <button
            onClick={() => router.push('/salesOverview')}
            className="bg-blue-500 text-white px-8 py-3 rounded font-semibold text-lg hover:bg-blue-600 transition mb-1 shadow"
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}
