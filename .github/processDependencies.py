import pandas as pd
import numpy as np

# return a matrix
def process_file(file):
    df = pd.read_csv(file)
    cols = list(df.columns)

    df = df.drop([index for index, row in df.iterrows() if row['Dependent File'] not in cols])
    df = df[[col for col in df.columns if (col == df["Dependent File"]).any()]].dropna(how='all')

    print('\nCyclic dependencies:\n', df)

    return np.nan_to_num(df.to_numpy(), nan=0)


def compute_percentages_dependencies(matrix, total_num_files):
    num_files, _ = matrix.shape
    violations = 0

    for i in range(num_files):
        for j in range(num_files):
            if matrix[i][j] != 0 and matrix[j][i] != 0 and i != j:
                violations += 1

    return {"Cyclic dependencies": violations / (2 * total_num_files)}