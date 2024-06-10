import pandas as pd
import numpy as np

# return a matrix
def process_file(file):
    df = pd.read_csv(file)

    non_dep_files = list(df)[1:]

    df = df.drop([index for index, row in df.iterrows() if row['Dependent File'] not in non_dep_files])
    df = df[[col for col in df.columns if (col == df["Dependent File"]).any()]]

    print(df)

    return df.fillna(0).to_numpy(dtype=int), list(df.columns)

def find_cycles(matrix, not_visited, path, cycles):
    N, _ = matrix.shape
    not_visited.remove(path[-1])

    for i in range(N):
        if matrix[path[-1]][i]: # there is a dependency
            if i in path: # cycle found
                cycles.append(path.copy())
            elif i in not_visited: # recurse
                path.append(i)
                find_cycles(matrix, not_visited, path, cycles)
                path.pop()
    
    if len(path) == 1 and len(not_visited) != 0: # find a new starting point if graph is disconnected
        find_cycles(matrix, not_visited, [next(iter(not_visited))], cycles)

def compute_percentages_dependencies(file, total_num_files):
    matrix, cols = process_file(file)

    N, _ = matrix.shape
    cycles = list()
    find_cycles(matrix, set([i for i in range(N)]), [0], cycles)

    # Show which cycles have been found
    for cycle in cycles:
        print(f"\nA cycle of length {len(cycle)} has been found:")
        for i in cycle:
            print(f"\t{cols[i]}")

    return {"Cyclic dependencies": len(cycles) / total_num_files}